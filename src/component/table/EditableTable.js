import React from 'react';
import {Table,Divider,Icon,message,Input,Popconfirm,Button,Upload,Modal} from 'antd';
import qs from 'qs';
import timeUtil from '../../util/timeUtil'
import global from '../../constant';
import {commomAxios} from '../../util/axios'

//无更新状态默认值
let disInputStatus = "02f-06d";
let jobTab = global.editable_job_tab;
let foodTab = global.editable_food_tab;
let userTab = global.editable_user_tab;
let adminTab = global.editable_admin_tab;
let commonUploalLogoUrl = global.common_uploalLogoUrl;
let buttonValue;
//1、列表 2、根据id删除 3、根据id更新,保持图片名不变
export default class EditableTable extends React.Component {

    state={
        visible:false,
        //table加载
        loading:false,
        //获取数据url
        getUrl:"",
        //数据
        dataSource:[],
        //分页
        pagination:{},
        //新增按钮是否能用
        insertButtonDisable:false,
        //新增标识
        insertType:0,
        //修改标识
        updateKey:disInputStatus,
        //修改的内容
        updateData:[null,null,null],
        //新增的内容
        insertData:[]
    };

    componentDidMount () {
        const {tableType} = this.props;
        //设置列
        this.FirstGet(tableType);
    };

    //第一次获取数据,注入分页基本配置信息
    FirstGet(tableType){
        this.setState({
            loading:true
        })
        let pagination = {};
        let url;
        switch (tableType){
            case jobTab:url="/commonTableApi/jobTypeList";break;
            case foodTab:url="/commonTableApi/foodTypeList";break;
            case userTab:url="/managementApi/getUser";break;
            case adminTab:url="/managementApi/getAdmin";break;
            default:url="/managementApi/getAdmin";break;
        }
        //获取数据
        commomAxios.get(url,{
            params : { //请求参数
                "pageNum" : 1
            }
        }).then((res)=>{
            let data = res.data.data;
            console.log(data);
            //数据总数
            pagination.total = data.total;
            //每页条数
            pagination.pageSize = data.pageSize;
            //当前页数
            pagination.current = data.pageNum;
            pagination.lastPage = data.lastPage;
            pagination.onChange=(page,pageSize)=>{
                let pager = { ...this.state.pagination };
                pager.current = page;
                commomAxios.get(url,{
                    params : { //请求参数
                        "pageNum": page
                    }
                }).then((res)=>{
                    let data = res.data.data;
                    console.log(data);
                    this.setState({
                        dataSource: data.list,
                        loading:false,
                        pagination: pager,
                    })

                })
            }

            this.setState({
                dataSource: data.list,
                loading:false,
                pagination,
                getUrl:url
            })

        })


    }
    //二次以上获取数据
    GetRequest = () => {
        this.massageSuccess();
        const {getUrl,insertType,updateKey} = this.state;
        const pager = { ...this.state.pagination };
        let pageNum = pager.current;
        let lastNum = pager.lastPage;

        commomAxios.get(getUrl,{
            params : { //请求参数
                "pageNum" : pageNum
            }
        }).then((res)=>{
            let data = res.data.data;
            //当前用户在最后一页，用户删除后最后一页发生变化；用户新增需跳到最后一页
            if(((data.lastPage!==lastNum)&&(pageNum===lastNum))||(insertType===1)){
                pager.current = data.lastPage;
            }else if(updateKey!==disInputStatus){
                pager.current = 1
            }
            console.log(data);
            this.setState({
                updateData:[null,null,null],
                dataSource: data.list,
                loading:false,
                insertType:0,
                insertButtonDisable:false,
                visible: false,
                pagination:pager,
                updateKey:disInputStatus
            })

        })
    }

    //post公用方法
    abstractPost=(url,data)=>{
        commomAxios.post(url,qs.stringify(data)).then((res)=>{
            console.log(res);
            //刷新table
            this.GetRequest();
        })
    }



    //修改按钮
    handleUpdate=(record)=>{
        this.setState({
            updateKey:record.key,
            insertButtonDisable:true
        })
    }
    //确认保存(更新)
    onUpdate=()=>{
        const {tableType} = this.props;
        const {updateKey,updateData} = this.state;
        let data,url;
        switch (tableType){
            case jobTab:
                url="/commonTableApi/updateJob";
                data={"jobTypeId":updateKey,"jobName":updateData[0]}
                break;
            case foodTab:
                url="/commonTableApi/updateFood";
                data={"foodTypeId":updateKey,"foodTypeName":updateData[1]}
                break;
            case adminTab:
                url="/managementApi/updateAdmin";
                data={"sysUserId":updateKey,"roleName":updateData[0],"accountNum":updateData[1],"password":updateData[2]}
                break;
            default:url=null;break;
        }
        //判断是否有修改
        if(updateData[0]!==null||updateData[1]!==null){
            this.abstractPost(url,data);
        }
        //保存完后
        this.handleCancel();


    }
    //取消按钮
    handleCancel=()=>{
        this.setState({
            updateKey: disInputStatus,
            insertData:[null,null,null],
            insertButtonDisable:false,
            insertType:0,
        })
    }
    //确认删除
    onDelete=(record)=>{
        let uuid = record.key;
        let data,url;
        const {tableType} = this.props;
        switch (tableType){
            case jobTab:
                url="/commonTableApi/deleteJob";
                data={"jobTypeId":uuid}
                break;
            case foodTab:
                url="/commonTableApi/deleteFood";
                data={"foodTypeId":uuid}
                break;
            case adminTab:
                url="/managementApi/deleteAdmin";
                data={"sysUserId":uuid};
                break;
            default:url=null;break;
        }
        this.abstractPost(url,data);
    }

    massageSuccess() {
        message.success("操作成功",2);
    }


    messageError() {
        message.error("页面发送错误",2);
    }





    render () {
        const {tableType} = this.props;
        const {dataSource,loading,pagination,visible} = this.state;
        let columns;
        const settingColumn = [{
            title: '设置',
            key: 'action',
            render: (text, record) => {
                let {updateKey} = this.state;
                return (
                    record.key===updateKey?<span>
                        <a onClick={this.onUpdate}>保存</a>
                        <Divider type="vertical"/>
                        <a onClick={this.handleCancel}>取消</a>
                    </span>
                        :
                        <span>
                        <a onClick={()=>this.handleUpdate(record)}>修改</a>
                        <Divider type="vertical"/>
                        <Popconfirm title="是否确认删除?" onConfirm={() => this.onDelete(record)} okText="确定" cancelText="取消">
                            <a>删除</a>
                        </Popconfirm>
                    </span>
                )
            },
        }];
        const jobColumns = [{
            title: '职位名称',
            dataIndex: 'jobName',
            render: (text,record) => {
                let {updateKey,updateData} = this.state;
                //修改
                return (record.key===updateKey?
                    <Input onChange={(e)=> {
                        updateData[0]=e.target.value;
                        this.setState({
                            updateData: updateData
                        })
                    }} prefix={<Icon type="team" style={{ fontSize: 13 }} />} placeholder="职位名称" value={updateData[0]===null?text:updateData[0]}/>
                    :<span>{text}</span>)
            },
        }];
        const foodTypeColums = [{
            title: '菜系名称',
            dataIndex: 'foodTypeName',
            render: (text,record) => {
                let {updateKey,updateData} = this.state;
                //修改
                return (record.key===updateKey?
                    <Input onChange={(e)=> {
                        updateData[0]=e.target.value;
                        this.setState({
                            updateData: updateData,
                        })
                    }} prefix={<Icon type="team" style={{ fontSize: 13 }} />} placeholder="菜系名称" value={updateData[0]===null?text:updateData[0]}/>
                    :<span>{text}</span>)
            },
        },{
            title: '图标',
            dataIndex: 'iconName',
            render: (text,record) => {
                let {updateKey} = this.state;
                console.log(text);
                //图片上传变化
                const handlePic=(info)=>{
                    if (info.file.status !== 'uploading') {
                        console.log(info.file, info.fileList);
                    }
                    if (info.file.status === 'done') {
                        message.success(`${info.file.name} file uploaded successfully`);
                    } else if (info.file.status === 'error') {
                        message.error(`${info.file.name} file upload failed.`);
                    }
                }

                return (record.key===updateKey?
                    <div>
                        <img style={{width:'60px',display:'inline'}} src={`http://localhost:8080/foodIcon/${text}.png`} alt={text}/>
                        <Upload action={commonUploalLogoUrl}
                                onChange={handlePic}>
                            <Button style={{marginLeft:'1rem'}}>
                                <Icon type="upload" /> 点击上传
                            </Button>
                        </Upload>
                    </div>
                    :<img style={{width:'60px',display:'inline'}} src={`http://localhost:8080/foodIcon/${text}.png`} alt={text}/>)
            },
        }];
        const userColumns = [{
            title: '昵称',
            dataIndex: 'username',
            render: (text,record) => {
                //修改
                return (<span>{text}</span>)
            }},{
            title: '手机号',
            dataIndex: 'phone',
            render: (text,record) => {
                //修改
                return (<span>{text}</span>)
            }},{
            title: '地址',
            dataIndex: 'address',
            render: (text,record) => {
                //修改
                return (<span>{text}</span>)
            }},{
            title: '注册日期',
            dataIndex: 'enrollDate',
            render: (text,record) => {
                //修改
                return (<span>{timeUtil.formatDateTime(text)}</span>)
            }},{
            title: '最后登录日期',
            dataIndex: 'lastLoginDate',
            render: (text,record) => {
                //修改
                return (<span>{timeUtil.formatDateTime(text)}</span>)
            }}];
        const adminColumns = [{
            title: '角色名称',
            width:"10rem",
            dataIndex: 'roleName',
            render: (text,record) => {
                let {updateKey,updateData} = this.state;
                //修改
                return (record.key===updateKey?
                    <Input onChange={(e)=> {
                        updateData[0]=e.target.value;
                        this.setState({
                            updateData: updateData
                        })
                    }} prefix={<Icon type="team" style={{ fontSize: 13 }} />} placeholder="角色名称" value={updateData[0]===null?text:updateData[0]}/>
                    :<span>管理员</span>)
            },
        },{
            title: '账号',
            width:"10rem",
            dataIndex: 'accountNum',
            render: (text,record) => {
                let {updateKey,updateData} = this.state;
                //修改
                return (record.key===updateKey?
                    <Input onChange={(e)=> {
                        updateData[1]=e.target.value;
                        this.setState({
                            updateData: updateData
                        })
                    }} prefix={<Icon type="team" style={{ fontSize: 13 }} />} placeholder="账号" value={updateData[1]===null?text:updateData[1]}/>
                    :<span>{text}</span>)
            },
        },{
            title: '密码',
            width:"35rem",
            dataIndex: 'password',
            render: (text,record) => {
                let {updateKey,updateData} = this.state;
                //修改
                return (record.key===updateKey?
                    <Input onChange={(e)=> {
                        updateData[2]=e.target.value;
                        this.setState({
                            updateData: updateData
                        })
                    }} prefix={<Icon type="team" style={{ fontSize: 13 }} />} placeholder="密码" value={updateData[2]}/>
                    :<span>{text}</span>)
            },
        },{
            title: '创建日期',
            width:"10rem",
            dataIndex: 'enrollDate',
            render: (text,record) => {
                //修改
                return (<span>{timeUtil.formatDateTime(text)}</span>)
            }},{
            title: '最后修改日期',
            width:"10rem",
            dataIndex: 'lastLoginDate',
            render: (text,record) => {
                //修改
                return (<span>{timeUtil.formatDateTime(text)}</span>)
            }}];
        switch (tableType){
            case jobTab:columns=jobColumns.concat(settingColumn);break;
            case foodTab:columns=foodTypeColums.concat(settingColumn);break;
            case userTab:columns=userColumns;break;
            case adminTab:columns=adminColumns.concat(settingColumn);break;
            default:columns=adminColumns.concat(settingColumn);break;
        }
        //根据表格类型返回不一样的按钮
        let TabsButton=()=>{
            if(tableType===jobTab){
                buttonValue="添加职位";
                return (
                    <Button icon="usergroup-add" type="primary" disabled={this.state.insertButtonDisable} onClick={handleAdd}>{buttonValue}</Button>
                );
            }else if(tableType===foodTab){
                buttonValue="添加菜系";
                return (
                    <Button icon="edit" type="primary" disabled={this.state.insertButtonDisable} onClick={handleAdd}>{buttonValue}</Button>
                );
            }else if(tableType===userTab){
                return null
            }else if(tableType===adminTab){
                buttonValue="添加管理员";
                return (
                    <Button icon="user" type="primary" disabled={this.state.insertButtonDisable} onClick={handleAdd}>{buttonValue}</Button>
                );
            }
        }
        //新增点击
        const handleAdd = () => {
            // const {dataSource} = this.state;
            // const pager = { ...this.state.pagination };
            // pager.current = 3;
            this.setState({
                visible: true,
                insertType:1,
                insertButtonDisable:true,
            });
        }
        //确认增加
        const handleOk = (e) => {
            let {insertData} = this.state;
            let insertUrl;
            let data;
            switch (tableType){
                case jobTab:
                    insertUrl="/commonTableApi/insertJob";
                    data={"jobName":insertData[0]}
                    break;
                case foodTab:
                    insertUrl="/commonTableApi/insertFoodType";
                    data={"foodTypeName":insertData[0],"iconName":insertData[1]}
                break;
                case adminTab:
                    insertUrl="/managementApi/insertAdmin";
                    data={"roleName":insertData[0],"accountNum":insertData[1],"password":insertData[2]}
                    break;
                default:insertUrl=null;break;
            }
            this.abstractPost(insertUrl,data);
        }
        //取消
        const handleCancel = (e) => {
            console.log(e);
            this.setState({
                visible: false,
                insertType:0,
                insertButtonDisable:false,
            });

        }
        //模态框列
        const InputMap=columns.map((item,index)=>{
            let title = item.title;
            let {insertData} = this.state;
            if(title!=="创建日期"&&title!=="最后登录日期"&&title!=="设置"&&title!=="最后修改日期") {
                return (<div key={index} style={{width:'30rem',height:'3rem'}}>
                    <div style={{float:'left',width:'5rem',height:'0.5rem',lineHeight:'2rem'}}>{title+" :"}</div>
                    <Input style={{float:'left',width:'23rem'}}
                        placeholder={"请输入" + title}
                        prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                        value={insertData[index]}
                        onChange={(e) => {
                            insertData[index] = e.target.value;
                            this.setState({
                                insertData
                            })
                        }}
                    />
                </div>)
            }
            return null;
        })



        return (
            <div>
                <TabsButton/>
                <div style={{margin:'0.8rem 0'}}>
                    <Table bordered={true}  columns={columns} dataSource={dataSource} loading={loading} pagination={pagination}/>
                </div>
                <Modal
                    title={buttonValue}
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="确定"
                    cancelText="取消"
                >
                    {InputMap}
                </Modal>
            </div>
        );
    }
}

