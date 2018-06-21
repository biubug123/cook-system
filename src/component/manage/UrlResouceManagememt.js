import React from 'react';
import {Table,Divider,Modal,Input,Icon,Button,Popconfirm} from 'antd'
import qs from 'qs';
import {commomAxios} from "../../util/axios";

export default class  extends React.Component {

    state={
        loading:true,
        visible:false,
        insertButtonDisable:false,
        //模态框类型 0:update 1:新增
        modalType:0,
        modalData:[],
        data:[],

    };

    componentDidMount () {
        this.requestGet();
        // React.getDOMNode()
    };
    //模态框提交
    handleOk=()=>{
        const {modalType,modalData} = this.state;
        console.log(modalData);
        let url =(modalType===1)?"/managementApi/insertResource":"/managementApi/updateResource";
        let data = {
            "resourceId": modalData[0],
            "alias":modalData[1],
            "url":modalData[2],
            "method":modalData[3],
            "description":modalData[4]
        };
        this.abstractPost(url,data);
    }
    requestGet=()=>{
        commomAxios.get("/managementApi/getResourceList").then((res)=>{
            let data = res.data;
            this.setState({
                data:data.data,
                insertButtonDisable:false,
                modalData:[],
                visible:false,
                loading:false
            })

        })
    }
    abstractPost=(url,data)=>{
        commomAxios.post(url,qs.stringify(data)).then((res)=>{
            let data = res.data;
            if(data.code === 200){
                this.requestGet();
            }

        })
    }
    onDelete=(record)=>{
        let key = record.key;
        let url = "/managementApi/deleteResource";
        let data = {"resourceId":key}
        this.abstractPost(url,data);
    }


    render () {
        const {visible,modalData,modalType,insertButtonDisable,loading}=this.state;
        const resouceColumns = [{
            title: '资源别名',
            dataIndex: 'alias',
            render: (text,record) => {
                return (<span>{text}</span>)
            }},{
            title: '资源路径',
            dataIndex: 'url',
            render: (text,record) => {
                return (<span>&nbsp;&nbsp;{text}</span>)
            }},{
            title: '资源方法',
            dataIndex: 'method',
            render: (text,record) => {
                return (<span>&nbsp;&nbsp;{text}</span>)
            }},{
            title: '详情描述',
            dataIndex: 'description',
            render: (text,record) => {
                return (<span>{text}</span>)
            }},{
            title: '被引用次数',
            dataIndex: 'citedTime',
            render: (text,record) => {
                return (<span>{text}</span>)
            }},{
            title: '操作',
            dataIndex: 'action',
            render: (text,record) => {
                //修改
                return (<span>
                    <a onClick={()=>{this.setState({
                        visible:true,
                        modalType:0,
                        insertButtonDisable:true
                    })}}>修改</a>
                    <Divider type="vertical"/>
                    <Popconfirm title="是否确认删除?" onConfirm={() => this.onDelete(record)} okText="确定" cancelText="取消">
                            <a>删除</a>
                        </Popconfirm>
                    </span>)
            }}];

        //模态框列
        const InputMap=resouceColumns.map((item,index)=>{
            let title = item.title;
            let {modalData} = this.state;
            if(title!=="被引用次数"&&title!=="操作") {
                return (
                <div key={index} style={{width:'30rem',height:'3rem'}}>
                    <div style={{float:'left',width:'5rem',height:'0.5rem',lineHeight:'2rem',textAlign:'right',marginRight:'1rem'}}>{title+" :"}</div>
                    <Input style={{float:'left',width:'23rem'}}
                           placeholder={"请输入" + title}
                           prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                           value={modalData[index+1]}
                           onChange={(e) => {
                               modalData[index+1] = e.target.value;
                               this.setState({
                                   modalData,
                               })
                           }}
                    />
                </div>)
            }
            return null;
        })
        return (
            <div>
                <Button icon="usergroup-add"
                        type="primary"
                        disabled={insertButtonDisable}
                        onClick={()=>{this.setState({modalData:[],insertButtonDisable:true,modalType:1,visible:true})}}>
                    新增访问资源</Button>
                <Table loading={loading} style={{marginTop:"1rem"}} onRow={(record, index) => {
                    return {
                        onClick: () => {
                            //uuid
                            modalData[0]=record.key;
                            modalData[1]=record.alias;
                            modalData[2]=record.url;
                            modalData[3]=record.method;
                            modalData[4]=record.description;
                        },
                    };
                }} columns={resouceColumns} dataSource={this.state.data}/>
                {/*新增的模态框*/}
                <Modal
                    title={modalType===0?"修改资源":"新增资源"}
                    visible={visible}
                    onOk={this.handleOk}
                    width={600}
                    cancelText="取消"
                    okText="确定"
                    onCancel={()=>{this.setState({
                        visible:false,
                        insertButtonDisable:false
                    })}}
                >
                    <div style={{height:"11.5rem"}}>
                        {InputMap}
                    </div>
                </Modal>
            </div>
        );
    }
}