import React, {Component} from 'react';
import { Layout, Table, Form, Icon} from 'antd'
import PublicBreadcrumb from '../../component/public/PublicBreadcrumb'

const { Content } = Layout;


const columns = [{
    title: '标题',
    dataIndex: 'title',
    key: 'title'
}, {
    title: '描述',
    dataIndex: 'description',
    key: 'description'
}, {
    title: '复用',
    dataIndex: 'mupltiplex',
    key: 'mupltiplex',
    render: (text, record) => {
        <Icon type="redo" theme="outlined" onClick={this.mupltiplex(text, record)} />
    }
}, {
    title: '详情',
    dataIndex: 'details',
    key: 'details',
    render:(text,record)=>{
        <Icon type="profile" theme="outlined" onClick={ console.log("待定") } />
    }
}];

export default class PushList extends Component {

    mupltiplex =(text, record) => {

    }


    render() {

        return(
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff'}}>
                <PublicBreadcrumb menu="表格" item="图文"/>
                <Table columns={columns} />
            </Content>
        )
    }
}