import React from 'react';
import {Layout,Upload,message, Button, Icon,Modal,Input,Popconfirm,Cascader,Table,Tag,Divider} from 'antd';
import PublicBreadcrumb from '../../component/public/PublicBreadcrumb'
import qs from 'qs';
import {commomAxios,fileAxios,advertisementDomain} from '../../util/axios'
import timeUtil from "../../util/timeUtil";


const { Content } = Layout;
const { TextArea } = Input;
const confirm = Modal.confirm;


//0、图片 1、视频
//2、视频id、title、description的上传
//3、图片、title、description的上传
//4、table 根据省和市
let uploader;
//无更新状态默认值
let disInputStatus = "02f-06d";
export default class Advertisement extends React.Component {

    state={
        //table的数据
        data:[],
        //分页器
        pagination:{currentPageNum:1},
        //文件
        fileList:[],
        //table加载
        loading:true,
        //模态框
        modalVisible: false,
        //模态框类型 0、图片 1、视频
        modalType:0,
        //标题
        title:"",
        //描述
        description:"",
        //城市选择列
        chooseCityList:[
            {
                //省id
                provinceId:"",
                provinceLabel:"",
                //市id
                cityId:"",
                cityLabel:"",
            }
        ],
        //所有省城市数据
        cityData:[],

        /*以下是update部分的state*/
        isUpdateModal:0,

        //当前修改列的所有信息
        currentUpdateColumData:{},
        //添加城市所在的id号
        inputCityVisibleId: disInputStatus,

    };

    componentWillMount () {
        this.requestGet();
        //省城
        commomAxios.get("/geo/getProvinceCity").then((res)=>{
            this.setState({
                cityData:res.data.data
            })
        })
        
    };

    componentDidMount =()=> {
        let {pagination}=this.state;
        pagination.onChange=(page,pageSize)=> {
            let pager = {...this.state.pagination};
            pager.current = page;
            commomAxios.get("/advertise/allAdvertisement/"+page).then((res) => {
                let data = res.data.data;
                this.setState({
                    data: data.list,
                    loading: false,
                    pagination: pager,
                })

            })
        }
        uploader = new window.AliyunUpload.Vod({
            //分片大小默认1M，不能小于100K
            partSize: 1048576,
            //并行上传分片个数，默认5
            parallel: 5,
            //网络原因失败时，重新上传次数，默认为3
            retryCount: 3,
            //网络原因失败时，重新上传间隔时间，默认为2秒
            retryDuration: 2,
            // 开始上传
            onUploadstarted:(uploadInfo)=> {
                console.log("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
                //上传方式1, 需要根据uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress，如果videoId有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
                // uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId);
                //上传方式2-STS
                this.getStsUpload(0,uploadInfo);

            },
            // 文件上传成功,数据库操作
            onUploadSucceed: (uploadInfo)=> {
                let {isUpdateModal,currentUpdateColumData} = this.state;
                console.log(uploadInfo);
                //videoId
                console.log(uploadInfo.videoId);
                let videoInfo=uploadInfo.videoInfo;
                let data;
                //当是更新模态框时
                if(isUpdateModal===1){
                    //更新
                    data={
                        advertisementId:currentUpdateColumData.id,
                        videoId:uploadInfo.videoId,
                        title:videoInfo.Title,
                        description:videoInfo.Description,
                        originVideoId:currentUpdateColumData.aliVideoId
                    }
                    //视频的更新
                    this.abstractPost("/advertise/updateVideoAdvertisement",data);
                }else {
                    //发起请求新增到数据库
                    data={
                        videoId:uploadInfo.videoId,
                        title:videoInfo.Title,
                        description:videoInfo.Description,
                        provinceCityVo:JSON.stringify(this.state.chooseCityList)
                    }
                    this.abstractPost("/advertise/publishVideo",data);
                }
                message.success("广告发布成功");
                console.log("onUploadSucceed:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
            },
            // 文件上传失败
            onUploadFailed: (uploadInfo, code, messages)=> {
                message.error("视频上传失败",messages);
                console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + messages);
            },
            // 文件上传进度，单位：字节
            onUploadProgress:(uploadInfo, totalSize, loadedPercent)=>{
                message.info("上传进度:"+Math.ceil(loadedPercent * 100) + "%");
                console.log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + Math.ceil(loadedPercent * 100) + "%");
            },
            // 上传凭证超时
            onUploadTokenExpired:(uploadInfo)=> {
                console.log("onUploadTokenExpired");
                //从新获取STS临时账号用于恢复上传
                this.getStsUpload(1);
                // uploader.resumeUploadWithSTSToken(accessKeyId, accessKeySecret, secretToken, expireTime);
            },
            //全部文件上传结束
            onUploadEnd:(uploadInfo)=>{
                console.log("onUploadEnd: uploaded all the files");
            }
        });

    };
    //获取stsToken
    getStsUpload=(type,uploadInfo)=>{
        commomAxios.get("/video/getStsToken").then((res)=>{
            let aliKey = res.data.data.credentials;
            if(res.data.code===200){
                console.log("获取sts成功,开始上传");
                if(type===0){
                    //第一次获取ststoken
                    uploader.setSTSToken(uploadInfo, aliKey.accessKeyId, aliKey.accessKeySecret,aliKey.securityToken);
                }else {
                    ////从新获取STS临时账号用于恢复上传
                    uploader.resumeUploadWithSTSToken(aliKey.accessKeyId, aliKey.accessKeySecret,aliKey.securityToken,aliKey.expiration);
                }

            }

        })

    }
    //操作后加载table数据
    requestGet=()=>{
        const {pagination}=this.state;
        commomAxios.get("/advertise/allAdvertisement/"+pagination.currentPageNum).then((res)=>{
            console.log(res.data.data);
            let datas = res.data.data;
            //数据总数
            pagination.total = datas.total;
            //每页条数
            pagination.pageSize = datas.pageSize;
            //当前页数
            pagination.current = datas.pageNum;
            pagination.lastPage = datas.lastPage;
            // 恢复初始状态
            if(res.data.code===200){
                this.setState({
                    pagination,
                    data:datas.list,
                    loading: false,
                    fileList:[],
                    modalVisible: false,
                    //模态框类型 0、图片 1、视频
                    modalType:0,
                    //标题
                    title:"",
                    //描述
                    description:"",
                    chooseCityList:[
                        {
                            //省id
                            provinceId:"",
                            provinceLabel:"",
                            //市id
                            cityId:"",
                            cityLabel:"",
                        }
                    ],

                    /*以下是update部分的state*/
                    isUpdateModal:0,

                    //当前修改列的所有信息
                    currentUpdateColumData:[],
                    //添加城市所在的id号
                    inputCityVisibleId: disInputStatus,
                })
            }
        })

    }
    //基本的post方法
    abstractPost=(url,data)=>{
        commomAxios.post(url,qs.stringify(data)).then((res)=>{
            let data = res.data;
            console.log(data);
            if(data.code === 200){
                message.success("提交成功");
                this.requestGet();
            }else {
                message.error("操作失败，请重试或联系管理员");
            }

        })
    }
    //基本的文件post方法
    abstractFilePost=(url,data)=>{
        fileAxios.post(url,data).then((res)=>{
            let data = res.data;
            if(data.code === 200){
                message.success("提交成功");
                this.requestGet();
            }else {
                message.error("操作失败，请重试或联系管理员");
            }

        })
    }

    //视频提交
    videoAdvertisement=() =>{
        const {fileList,chooseCityList,title,description} = this.state;
        console.log(chooseCityList);
        let tags="";
        for(let i=0;i<chooseCityList.length;i++){
            tags+=chooseCityList[i].provinceLabel+chooseCityList[i].cityLabel+","
        }
        //除去最后的逗号
        tags=tags.substring(0,tags.lastIndexOf(","));
        console.log(tags);
        //分类id： 广告-603126956
        let userData = '{"Vod":{"Title":"'+title+'","Description":"'+description+'","CateId":"603126956","Tags":"'+tags+'"}}';
        console.log(userData);
        console.log(fileList);
        for(var i=0; i<fileList.length; i++) {
            // 逻辑代码
            uploader.addFile(fileList[i], null, null, null, userData);
        }
        //视频上传
        uploader.startUpload();
    }
    //模态框提交
    modalSubmit=()=>{
        const {title,description,fileList,chooseCityList,modalType,isUpdateModal}=this.state;
        if(title.length===0||description===0){
            message.error('标题或描述不得为空');
            return;
        }else if(chooseCityList[0].provinceId===""&&isUpdateModal===0){
            message.error('请选择城市');
            return;
        }else if(fileList.length===0){
            message.error('请选择需要发布的内容');
            return;
        }

        // let data;
        //新增模态框操作
        if(isUpdateModal===0){
            if(modalType===1){
                message.info("正在处理……");
                message.info("开始视频上传……");
                // 视频提交
                this.videoAdvertisement();
            }else {
                //图片
                this.imageAdvertisement();
            }
        }else {
            //更新模态框操作
            this.updateAdvertisement();
        }
        this.modalCancel();

    }
    //模态框取消
    modalCancel=()=>{
        let {chooseCityList} = this.state;
        this.setState({
            modalVisible:false,
        })
        setTimeout(()=>{
            this.setState({
                fileList:[],
                //标题
                title:"",
                //描述
                description:"",
                isUpdateModal:0,
                chooseCityList:[chooseCityList[0]]
            })
        },1000)

    }
    //折叠框变化
    cascaderChange=(e,selectedOptions,index)=>{
        console.log(e,selectedOptions);
        //选择框list
        let {chooseCityList}=this.state;
        //省id
        chooseCityList[index].provinceId=selectedOptions[0].value;
        chooseCityList[index].provinceLabel=selectedOptions[0].label;
        //市id
        chooseCityList[index].cityId=selectedOptions[1].value;
        chooseCityList[index].cityLabel=selectedOptions[1].label;
        // if(chooseCityList[chooseCityList.length-1].provinceId.length!==0){
        //     let newData = {
        //         //省id
        //         provinceId:"",
        //         provinceLabel:"",
        //         //市id
        //         cityId:"",
        //         cityLabel:"",
        //     }
        //     chooseCityList.push(newData);
        // }
        this.setState({
            chooseCityList:chooseCityList
        })
    }
    //城市列表取消选择
    handleCancel=(index)=>{
        let {chooseCityList}=this.state;
        this.setState({
            chooseCityList:chooseCityList.slice(0,index)
        })

    }
    handelAddCity=()=>{
        let {chooseCityList}=this.state;
        console.log("点击");
        let newData = {
            //省id
            provinceId:"",
            provinceLabel:"",
            //市id
            cityId:"",
            cityLabel:"",
        }
        chooseCityList.push(newData);
        this.setState({
            chooseCityList:chooseCityList
        })
    }
    //发布广告按钮点击
    handleClick=(type)=>{
        this.setState({
            modalVisible:true,
            modalType:type
        })
    }
    //修改广告信息
    updateAdvertisement=()=>{
        let {fileList,currentUpdateColumData,title,description}=this.state;
        //判断有无修改视频或图片的痕迹
        if(fileList[0].uid!==-1){
            //0:图片 1、视频
            if(currentUpdateColumData.type===0){
                //图片的修改
                this.imageAdvertisement();
            }else {
                message.info("正在处理……");
                message.info("开始视频上传……");
                // 视频提交
                this.videoAdvertisement();
            }
        }else {
            message.info("正在处理……");
            //仅仅修改标题和信息，没有对视频和图片进行操作
            let data={
                advertisementId:currentUpdateColumData.id,
                title:title,
                description:description,
                originVideoId:currentUpdateColumData.aliVideoId
            }
            console.log(data);
            this.abstractPost("/advertise/JustUpdateAdvertisementTitleAndDescription",data);
        }


    }
    //删除广告
    deleteAdvertisement=(record)=>{
        message.info("正在处理……");
        this.abstractPost("/advertise/deleteAdvertisement",{"advertisementId":record.id,"imageUrl":record.imageUrl,"originVideoId":record.aliVideoId})
    }
    //删除城市
    deleteCity=(item,record,e)=>{
        e.preventDefault();
        let data={
            advertisementId:record.id,
            cityCode:item.code,
            originVideoId:record.aliVideoId,
            originCityList:JSON.stringify(record.cityList)
        }
        confirm({
            title: '是否删除此条广告的城市',
            content: '如果删除，在该城市的用户便无法看到此条广告',
            okText: '确认',
            cancelText: '取消',
            onOk:()=> {
                message.info("正在处理……");
                this.abstractPost("/advertise/deleteCity",data);
            },
            onCancel:()=> {},
        });

    }
    //新增城市
    insertCity=(e,record,select)=>{
        console.log(e);
        console.log(select);
        if(select!=null){
            message.info("正在提交……");
            let newTag = select[0].label+select[1].label;
            let cityCode = e[1];
            let data={
                advertisementId:record.id,
                cityCode:cityCode,
                originVideoId:record.aliVideoId,
                originCityList:JSON.stringify(record.cityList),
                newTag:newTag
            }
            this.abstractPost("/advertise/insertCity",data);
        }

    }
    //修改按钮点击
    handleUpdate=(record)=>{
        let data={
            uid: -1,
            name: record.title,
            status: 'done',
        };
        //0:图片 1、视频
        if(record.type===0){
            data.url=record.imageUrl;
        }else {
            data.url=record.videoUrl
        }
        this.setState({
            isUpdateModal:1,
            title:record.title,
            description:record.description,
            modalVisible:true,
            currentUpdateColumData:record,
            fileList:[data]
        })
    }
    //图片广告
    imageAdvertisement=()=>{
        let data=new FormData();
        let {chooseCityList,title,description,isUpdateModal,currentUpdateColumData}=this.state;
        data.append("file",this.state.fileList[0])
        data.append("title",title);
        data.append("description",description);
        data.append("originImageUrl",currentUpdateColumData.imageUrl);
        if(isUpdateModal===0){
            data.append("provinceCityVo",JSON.stringify(chooseCityList));
            this.abstractFilePost("/advertise/publishImage",data);
        }else {
            //广告id
            data.append("advertisementId",currentUpdateColumData.id);
            this.abstractFilePost("/advertise/updateImageAdvertisement",data);
        }


    }

    render () {
        const {fileList,modalVisible,title,loading,pagination,description,cityData,modalType,chooseCityList,data,isUpdateModal} = this.state;
        //uoload上传属性
        const props = {
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList }) => ({
                    fileList: [...fileList, file],
                }));
                return false;
            },
            accept:modalType===0?"image/*":"video/*",
            listType:'text',
            fileList: fileList,
            disabled: fileList.length>0
        };
        //城市选择
        let ChooseCitys=chooseCityList.map((item,index)=>{
            return(
                <div key={index}>
                    <span>广告城市{index+1}:&nbsp;&nbsp;</span>
                    <Cascader allowClear={false} placeholder="选择城市" options={cityData} size="large" onChange={(e,select)=>this.cascaderChange(e,select,index)}/>
                    &nbsp;&nbsp;
                    {index>0&&index===chooseCityList.length-1?<a onClick={()=>this.handleCancel(index)}>取消&nbsp;&nbsp;&nbsp;</a>:null}
                    {/*上传*/}
                    {index===0?
                        <span>
                            <a onClick={this.handelAddCity}>添加城市</a>
                            &nbsp;
                        </span>:null}
                    <div style={{margin:'0.5rem 0'}}></div>
                </div>
            )
        })
        let colors = ["magenta","red","volcano","orange","gold","green","cyan","blue","geekblue","purple"];
        const columns = [{
            title: '广告标题',
            dataIndex: 'title',
            key: 'title',
            width:"10rem",
            render: text => <a>{text}</a>,
        }, {
            title: '时间',
            dataIndex: 'duration',
            key: 'duration',
            width:"6rem",
            sorter: (a, b) => a.duration - b.duration,
            render: (text, record) => (
                <span>{record.duration}{record.duration?"秒":""}</span>
            ),
        }, {
            title: '城市',
            key: 'cityList',
            width:"18rem",
            render: (text, record) => {
                let {inputCityVisibleId} = this.state;
                const citysElements = [];
                let colorIndex;
                record.cityList.forEach((item, index) => {
                    colorIndex = Math.floor((Math.random()*10));
                    citysElements.push(<Tag key={index} onClose={(e)=>{this.deleteCity(item,record,e)}} closable color={colors[colorIndex]}>{item.provinceName}{item.name}</Tag>)
                })
                let cityInput = inputCityVisibleId === record.id? <Cascader placeholder="选择城市" key={record.id} options={cityData} size="small" onChange={(e,select)=>{this.insertCity(e,record,select)}}/>
                    :<Tag key={record.id}
                    onClick={()=>this.setState({inputCityVisibleId:record.id})}
                    style={{ background: '#fff', borderStyle: 'dashed' }}
                >
                    <Icon type="plus" /> 添加新的城市
                </Tag>
                citysElements.push(cityInput);
                return(
                    <div>
                        {citysElements}
                    </div>
                )
            },
        },{
            title: '广告',
            key: 'advertisement',
            render: (text, record) => (
                //type:0 图片广告 1视频广告
                <div>
                    {
                        record.type===0?
                            <img style={{width:"80%",height:"auto"}} alt={record.title} src={advertisementDomain+record.imgUrl}></img>:
                        <video width="60%" height="20%" controls>
                            <source src={record.videoUrl}  type="video/mp4"/>
                        </video>

                    }

                </div>
            ),
        },{
            title: '发布日期',
            dataIndex: 'publishDate',
            width:"10rem",
            sorter: (a, b) => a.publishDate - b.publishDate,
            render: (text,record) => {
                //修改
                return (<span>{timeUtil.formatDateTime(record.publishDate)}</span>)
        }},{
            title: '操作',
            key: 'action',
            width:"8rem",
            render: (text, record) => (
                <div>
                    <a onClick={()=>this.handleUpdate(record)}>修改</a>
                    <Divider type="vertical" />
                    <Popconfirm title="是否确认删除?" onConfirm={() => this.deleteAdvertisement(record)} okText="确定" cancelText="取消">
                        <a>删除</a>
                    </Popconfirm>
                </div>

            ),
        }];


        //城市集合遍历
        return (
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff'}}>
                <PublicBreadcrumb menu="发布" item="广告"/>
                <div style={{margin:"0.5rem"}}>
                    {/*<Row justify="end">*/}
                        <Button type="primary" style={{marginRight:"0.5rem"}} onClick={()=>this.handleClick(0)}>发布图片广告</Button>
                        <Button type="primary" onClick={()=>this.handleClick(1)}>发布视频广告</Button>
                    {/*</Row>*/}
                </div>
                <Table expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>} loading={loading} pagination={pagination}  columns={columns} rowKey={record => record.id} dataSource={data} />
                {/*提交或修改的模态框*/}
                <Modal
                    maskClosable={false}
                    okText={isUpdateModal===0?"提交":"修改"}
                    cancelText="取消"
                    title={modalType===0?"图片广告":"视频广告"}
                    visible={modalVisible}
                    onOk={this.modalSubmit}
                    onCancel={this.modalCancel}
                >
                    <Input style={{marginBottom:"1rem"}} addonBefore={"标题:"} value={title} onChange={(e)=>this.setState({title:e.target.value})}/>
                    <span>描述:</span><TextArea style={{marginTop:"0.3rem"}} type="textarea" autosize={{ minRows: 6}} value={description} onChange={(e)=>this.setState({description:e.target.value})}/>
                    <div style={{margin:'1rem 0'}}></div>
                    <Upload {...props}>
                        <Button disabled={fileList.length>0}>
                            <Icon type="rocket"/>{modalType===0?"选择图片":"选择视频"}
                        </Button>
                    </Upload>
                    {isUpdateModal===1?null:ChooseCitys}
                </Modal>
            </Content>
        );
    }
}