import React from 'react';
import {Layout,Breadcrumb,Upload,message, Button, Icon,Modal,Input,Cascader} from 'antd';
import {Link} from 'react-router-dom'
import global from '../../constant';
import {commomAxios} from '../../util/axios'


const { Content } = Layout;
const { TextArea } = Input;

//1、省和市嵌套data value、label
//2、视频id、title、description的上传
//3、图片、title、description的上传
//4、table 根据省和市
let uploader;
export default class Advertisement extends React.Component {

    state={
        fileList:[],
        modalVisible: false,
        //模态框类型 0、图片 1、视频
        modalType:0,
        //标题
        title:"",
        //描述
        description:"",
        //省id
        provinceId:"",
        provinceLabel:"",
        //市id
        cityId:"",
        cityLabel:"",

        cityData:[{
            value: '1',
            label: '广东省',
            children: [{
                value: '101',
                label: '广州市',
            }],
        }, {
            value: '2',
            label: '湖南省',
            children: [{
                value: '201',
                label: '常德市',
            }],
        }]
    };

    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };

    componentDidMount =()=> {
        // eslint-disable-next-line
            uploader = new AliyunUpload.Vod({
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
                commomAxios.get("/video/getStsToken").then((res)=>{
                    let aliKey = res.data.data.credentials;
                    if(res.data.code===200){
                        console.log("获取sts成功,开始上传");
                        uploader.setSTSToken(uploadInfo, aliKey.accessKeyId, aliKey.accessKeySecret,aliKey.securityToken);
                    }

                })

            },
            // 文件上传成功
            onUploadSucceed: (uploadInfo)=> {
                this.setState({
                    fileList:[]
                })
                console.log(uploadInfo);
                //videoId
                console.log(uploadInfo.videoId);
                let videoInfo=uploadInfo.videoInfo;
                //标题
                console.log(videoInfo.Title);
                //描述
                console.log(videoInfo.Description);
                //发起请求上传到数据库
                
                
                console.log("onUploadSucceed: " + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
            },
            // 文件上传失败
            onUploadFailed: (uploadInfo, code, message)=> {
                console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message);
            },
            // 文件上传进度，单位：字节
            onUploadProgress:(uploadInfo, totalSize, loadedPercent)=>{
                console.log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + Math.ceil(loadedPercent * 100) + "%");
            },
            // 上传凭证超时
            onUploadTokenExpired:(uploadInfo)=> {
                console.log("onUploadTokenExpired");
                //从新获取STS临时账号用于恢复上传
                commomAxios.get("/video/getStsToken").then((res)=>{
                    let aliKey = res.data.data.credentials;
                    if(res.data.code===200){
                        console.log("获取sts成功,重新上传");
                        uploader.resumeUploadWithSTSToken(aliKey.accessKeyId, aliKey.accessKeySecret,aliKey.securityToken,aliKey.expiration);
                    }

                })
                // uploader.resumeUploadWithSTSToken(accessKeyId, accessKeySecret, secretToken, expireTime);
            },
            //全部文件上传结束
            onUploadEnd:(uploadInfo)=>{
                console.log("onUploadEnd: uploaded all the files");
            }
        });

        // React.getDOMNode()
    };
    //视频提交
    startUpload=(title,description) =>{
        console.log(this.state.accessKeyId);
        const {fileList,provinceLabel,cityLabel} = this.state;
        //分类id： 广告-603126956
        let userData = '{"Vod":{"Title":'+title+',"Description":'+description+',"CateId":"603126956","Tags":"'+provinceLabel+','+cityLabel+'"}}';
        for(var i=0; i<fileList.length; i++) {
            // 逻辑代码
            uploader.addFile(fileList[i], null, null, null, userData);
        }
        uploader.startUpload();
    }
    //模态框提交
    modalSubmit=()=>{
        const {title,description,fileList,cityId,modalType}=this.state;
        if(title.length===0||description===0){
            message.error('标题或描述不得为空');
            return;
        }else if(cityId.length===0){
            message.error('请选择城市');
        }else if(fileList.length===0){
            message.error('请选择需要发布的视频');
            return;
        }
        if(modalType===1){
            // 视频提交
            this.startUpload(title,description);
        }


    }
    modalCancel=()=>{
        this.setState({
            fileList:[],
            modalVisible:false,
            //标题
            title:"",
            //描述
            description:"",
            //省id
            provinceId:"",
            provinceLabel:"",
            //市id
            cityId:"",
            cityLabel:"",
        })
    }
    //折叠框变化
    cascaderChange=(e,selectedOptions)=>{
        this.setState({
            //省id
            provinceId:selectedOptions[0].value,
            provinceLabel:selectedOptions[0].label,
            //市id
            cityId:selectedOptions[1].value,
            cityLabel:selectedOptions[1].label,
        })
    }
    //发布广告按钮点击
    handleClick=(type)=>{
        this.setState({
            modalVisible:true,
            modalType:type
        })
    }
    render () {
        let projectName = global.projectName;
        const {fileList,modalVisible,title,description,cityData,modalType} = this.state;
        const props = {
            //移除
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
            listType:'text',
            fileList: fileList,
            disabled: fileList.length>0
        };
        return (
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff'}}>
                <Breadcrumb>
                    <Breadcrumb.Item><Link to={`/${projectName}`}>首页</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>图表</Breadcrumb.Item>
                    <Breadcrumb.Item>广告管理</Breadcrumb.Item>
                </Breadcrumb>
                <Button type="primary" onClick={()=>this.handleClick(0)}>图片广告</Button>
                <Button type="primary" onClick={()=>this.handleClick(1)}>视频广告</Button>
                {/*模态框*/}
                <Modal
                    maskClosable={false}
                    okText="提交"
                    cancelText="取消"
                    title={modalType===0?"发布图片广告":"发布视频广告"}
                    visible={modalVisible}
                    onOk={this.modalSubmit}
                    onCancel={this.modalCancel}
                >
                    <Input style={{marginBottom:"1rem"}} addonBefore={"标题:"} value={title} onChange={(e)=>this.setState({title:e.target.value})}/>
                    <span>描述:</span><TextArea style={{marginTop:"0.3rem"}} type="textarea" autosize={{ minRows: 6}} value={description} onChange={(e)=>this.setState({description:e.target.value})}/>
                    <div style={{margin:'1rem 0'}}></div>
                    <span>广告城市:&nbsp;&nbsp;</span><Cascader placeholder="选择城市" options={cityData} size="large" onChange={this.cascaderChange}/>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Upload {...props}>
                        <Button disabled={fileList.length>0}>
                            <Icon type="rocket"/>{modalType===0?"选择图片":"选择视频"}
                        </Button>
                    </Upload>
                </Modal>

            </Content>
        );
    }
}