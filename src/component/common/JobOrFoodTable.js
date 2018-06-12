import React from 'react';
import {Table,Divider,Icon,message,Input,Popconfirm,Button,Upload} from 'antd';
import {commomAxios} from '../../util/axios'

let disInputStatus = "0-0";
//1、列表 2、根据id删除 3、根据id更新,保持图片名不变
export default class JobOrFoodTable extends React.Component {

    state={
        columns:[],
        dataSource:[],
        //新增按钮是否能用
        insertButtonDisable:false,
        //新增标识
        insertType:0,
        //修改标识
        updateKey:disInputStatus,
        //修改或新增的内容
        //第一列
        updateColumnValue1:disInputStatus,
        //第二列
        updateColumnValue2:disInputStatus,
    };

    componentWillMount () {
        const {tableType} = this.props;
        const settingColumn = [{
            title: '设置',
            key: 'action',
            render: (text, record) => {
                let {updateKey} = this.state;
                return (
                    record.key===updateKey?<span>
                        <a onClick={this.onUpdate}>确定</a>
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
            key: 'jobName',
            render: (text,record) => {
                let {updateKey,updateColumnValue1} = this.state;
                //修改
                return (record.key===updateKey?
                    <Input onChange={(e)=> {
                        this.setState({
                            updateColumnValue1: e.target.value,
                        })
                    }} prefix={<Icon type="team" style={{ fontSize: 13 }} />} placeholder="职位名称" value={updateColumnValue1===disInputStatus?text:updateColumnValue1}/>
                    :<span>{text}</span>)
            },
        }];
        const foodTypeColums = [{
            title: '菜系名称',
            dataIndex: 'foodTypeName',
            key: 'foodTypeName',
            render: (text,record) => {
                let {updateKey,updateColumnValue1} = this.state;
                //修改
                return (record.key===updateKey?
                    <Input onChange={(e)=> {
                        this.setState({
                            updateColumnValue1: e.target.value,
                        })
                    }} prefix={<Icon type="team" style={{ fontSize: 13 }} />} placeholder="菜系名称" value={updateColumnValue1===disInputStatus?text:updateColumnValue1}/>
                    :<span>{text}</span>)
            },
        },{
            title: '图标',
            dataIndex: 'iconName',
            key: 'iconName',
            render: (text,record) => {
                let {updateKey} = this.state;
                console.log(record);
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
                        <img style={{width:'60px',display:'inline'}} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" alt="菜.png"/>
                        <Upload action="//jsonplaceholder.typicode.com/posts/"
                                onChange={handlePic}>
                            <Button style={{marginLeft:'1rem'}}>
                                <Icon type="upload" /> 点击上传
                            </Button>
                        </Upload>
                    </div>
                    :<img style={{width:'60px',display:'inline'}} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" alt="菜.png"/>)
            },
        }]
        //发起请求获取的数据
        let columns = (tableType==="job")?jobColumns.concat(settingColumn):foodTypeColums.concat(settingColumn);
        this.requestGet(tableType,columns);
    };
    requestGet(tableType,columns){
        let url=(tableType==="job")?"/commonTableApi/jobTypeList":"/commonTableApi/foodTypeList";

        commomAxios.get(url).then((res)=>{
            console.log(res.data.data);
            this.setState({
                columns:columns,
                dataSource:res.data.data
            })
        })
    }

    componentDidMount () {
        // React.getDOMNode()
    };

    //新增职位点击
    handleAdd = () => {
        const {dataSource} = this.state;
        const newData = {
            key: disInputStatus,
            jobName: "",
        };
        this.setState({
            dataSource: [...dataSource, newData],
            insertType:1,
            insertButtonDisable:true
        });
    }
    //修改按钮
    handleUpdate=(record)=>{
        this.setState({
            updateKey:record.key,
            insertButtonDisable:true
        })
    }
    //保存
    onUpdate=()=>{

        console.log("uuid:",this.state.updateKey);
        console.log("修改内容:",this.state.updateColumnValue1);
        //保存完后
        this.setState({
            updateKey:disInputStatus,
            updateColumnValue1:disInputStatus
        })
    }
    //取消按钮
    handleCancel=()=>{
        let {insertType,dataSource} = this.state;
        if (insertType === 0) {
            this.setState({
                updateKey: disInputStatus,
                updateColumnValue1: disInputStatus,
                insertButtonDisable:false
            })
        }else {
            this.setState({
                dataSource:dataSource.slice(0,dataSource.length-1),
                insertType:0,
                insertButtonDisable:false
            })
        }
    }
    //确认删除
    onDelete=(record)=>{
        let uuid = record.key;
        console.log("uuid:",uuid);
    }




    render () {
        const {tableType} = this.props;
        const {columns,dataSource} = this.state;
        let buttonContent = (tableType==="job")?"添加职位":"添加菜系";
        let buttonIcon = (tableType==="job")?"usergroup-add":"edit";


        return (
            <div>
                <Button icon={buttonIcon}  type="primary" disabled={this.state.insertButtonDisable} onClick={this.handleAdd}>{buttonContent}</Button>
                <div style={{margin:'0.8rem 0'}}>
                    <Table bordered={true} columns={columns} dataSource={dataSource}/>
                </div>
            </div>
        );
    }
}

