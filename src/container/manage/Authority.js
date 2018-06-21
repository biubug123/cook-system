import React from 'react';
import {Layout,Tabs} from 'antd';
import RoleManagement from '../../component/manage/RoleManagement'
import UrlResouceManagememt from '../../component/manage/UrlResouceManagememt'
import PublicBreadcrumb from '../../component/public/PublicBreadcrumb'
const TabPane = Tabs.TabPane;
const { Content } = Layout;



export default class Authority  extends React.Component {

    state={

    };


    componentDidMount () {
        // React.getDOMNode()
    };


    render () {

        return (
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff'}}>
                <PublicBreadcrumb menu="管理" item="权限管理"/>
                <Tabs tabPosition='left' defaultActiveKey="1" style={{marginTop:'2rem'}}>
                    <TabPane tab="角色管理" key="1">
                        <RoleManagement/>
                    </TabPane>
                    <TabPane tab="访问资源管理" key="2">
                        <UrlResouceManagememt/>
                    </TabPane>
                </Tabs>

            </Content>

        );
    }
}