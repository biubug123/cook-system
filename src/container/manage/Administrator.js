import React from 'react';
import {Layout} from 'antd';
import EditableTable from '../../component/table/EditableTable'
import global from '../../constant';
import PublicBreadcrumb from '../../component/public/PublicBreadcrumb'

const { Content } = Layout;

export default class User extends React.Component {



    render () {

        let adminTab = global.editable_admin_tab;

        return (

            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff'}}>
                <PublicBreadcrumb menu="管理" item="系统管理员"/>
                <div style={{marginTop:'1.3rem'}}>
                    <EditableTable tableType={adminTab}/>
                </div>

            </Content>
        );
    }
}

