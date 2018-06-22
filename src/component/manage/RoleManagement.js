import React from 'react';
import {Table,Divider,Modal,Transfer,Button,Input,Icon,Popconfirm} from 'antd';
import timeUtil from "../../util/timeUtil";
import qs from 'qs';
import {commomAxios} from '../../util/axios'


//无更新状态默认值
let disInputStatus = "02f-06d";
export default class RoleManagement extends React.Component {

    state={
        loading:true,
        insertButtonDisable:false,
        modalResourceData:[],
        modalTargetKey:[],
        //新增状态
        insertType:0,
        selectedKeys: [],
        data:[],
        visible:false,
        roleData:null,
        updateKey:null,
        currentRoleId:null
    };
    requestGet=()=>{
        commomAxios.get("/managementApi/getRoleList").then((res)=>{
            let data = res.data;
            this.setState({
                data:data.data,
                insertType:0,
                updateKey:null,
                loading:false,
                visible: false,
                modalResourceData:[]
            })

        })
    }

    componentDidMount () {
        this.requestGet();
        // React.getDOMNode()
    };



    //模态框确认
    handleOk = (e) => {
        let {modalResourceData,currentRoleId} = this.state;
        let url = "/managementApi/conRolePermission";
        let data = [];
        for(let i=0;i<modalResourceData.length;i++){
            let newData = {
                "sysRoleId": currentRoleId,
                "sysPermissionId": modalResourceData[i].key
            };
            data.push(newData);
        }
        this.abstractPost(url,{"conRolePermissionList":JSON.stringify(data)});
    }
    //模态框取消
    handleCancel = (e) => {
        this.setState({
            visible: false,
            currentRoleId:null
        });
    }
    //列保存更新
    onSave=()=>{
        const {insertType,updateKey,roleData} = this.state;
        let url =(insertType===1)?"/managementApi/insertRole":"/managementApi/updateRole";
        let data = (insertType===1)?{"roleName":roleData}:{"roleId":updateKey,"roleName":roleData};
        this.abstractPost(url,data);
    }
    //基本的post方法
    abstractPost=(url,data)=>{
        commomAxios.post(url,qs.stringify(data)).then((res)=>{
            let data = res.data;
            if(data.code === 200){
                this.requestGet();
            }

        })
    }
    //穿梭框选项点击
    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
    }
    //穿梭框点击切换
    handleChange = (nextTargetKeys, direction, moveKeys) => {
        console.log(nextTargetKeys);
        this.setState({ modalTargetKey: nextTargetKeys });

    }
    //列删除
    onDelete=(record)=>{
        let key = record.key;
        let url = "/managementApi/deleteRole";
        let data = {"roleId":key}
        this.abstractPost(url,data);
    }
    //打开模态框
    modalOpen=(record)=>{
        this.setState({
            visible:true,
            currentRoleId:record.key
        });
        commomAxios.get("/managementApi/getResourceByRoleId",{params:{"roleId":record.key}}).then((res)=>{
            this.setState({
                modalTargetKey:res.data.data.map(item => item.key)
            })
        }).then(commomAxios.get("/managementApi/getResources").then((res)=>{
            setTimeout(()=>{
                this.setState({
                    modalResourceData:res.data.data
                })},500)
        }))



    }
    render () {
        let {insertButtonDisable,data,roleData,updateKey,insertType,loading,modalResourceData,selectedKeys,modalTargetKey} = this.state;
        const roleColumns = [{
            title: '角色名称',
            dataIndex: 'name',
            render: (text,record) => {
                return (record.key===disInputStatus||record.key===updateKey?
                    <Input onChange={(e)=> {
                        roleData=e.target.value;
                        this.setState({
                            roleData,
                        })
                    }} prefix={<Icon type="team" style={{ fontSize: 13 }} />} placeholder="角色名称" value={roleData===null?text:roleData}/>
                    :<span>{text}</span>)
            }},{
            title: '创建时间',
            dataIndex: 'createDate',
            render: (text,record) => {
                return (<span>{timeUtil.formatDateTime(text)}</span>)
            }},{
            title: '操作',
            dataIndex: 'action',
            render: (text,record) => {
                return (record.key===disInputStatus||record.key===updateKey?<span>
                        <a onClick={this.onSave}>保存</a>
                        <Divider type="vertical"/>
                        <a onClick={()=>{
                            if(insertType===1){this.setState({data:data.slice(0,data.length-1)})}
                            this.setState({insertButtonDisable:false,insertType:0,updateKey:null,roleData:null})
                        }
                        }>取消</a>
                    </span>
                    :
                    <span>
                        <a onClick={()=>{this.modalOpen(record)}}>授权</a>
                        <Divider type="vertical"/>
                        <a onClick={()=>{this.setState({updateKey:record.key,roleData:record.name})}}>修改名称</a>
                        <Divider type="vertical"/>
                        <Popconfirm title="是否确认删除?" onConfirm={() => this.onDelete(record)} okText="确定" cancelText="取消">
                            <a>删除</a>
                        </Popconfirm>
                    </span>)
            }}];
        const buttonClick = ()=>{
            let concatData = {
                key:disInputStatus,
                name:null,
                createDate:new Date().getTime()/1000
            }
            this.setState({
                insertButtonDisable:true,
                insertType:1,
                data:data.concat(concatData)
            })
        }
        return (
            <div>
                <Button icon="usergroup-add"
                        type="primary"
                        disabled={insertButtonDisable}
                        onClick={buttonClick}>
                    新增角色</Button>
                <Table loading={loading} style={{marginTop:"1rem"}} columns={roleColumns}  dataSource={data}/>
                <Modal
                    title="编辑角色资源授权"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    width={600}
                    cancelText="取消"
                    okText="确定"
                    onCancel={this.handleCancel}
                >
                    <Transfer
                        listStyle={{width:'15.8rem',height:'20rem'}}
                        dataSource={modalResourceData}
                        titles={['可选的资源名称','已选的资源名称']}
                        targetKeys={modalTargetKey}
                        selectedKeys={selectedKeys}
                        onChange={this.handleChange}
                        onSelectChange= {this.handleSelectChange}
                        render={item => {
                            return(
                                <div style={{float:"right"}}>
                                    <div style={{fontSize:'18px',textAlign:'right'}}>{item.alias}</div>
                                    <div style={{fontSize:'14px',color:'#999999',textAlign:'right'}}>{item.description}</div>
                                </div>
                            )
                        }}
                    />
                </Modal>
            </div>
        );
    }
}