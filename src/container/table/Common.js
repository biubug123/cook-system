import React from 'react';
import {Layout,Breadcrumb,Table,Divider,Icon,Tabs} from 'antd';
import JobOrFoodTable from '../../component/common/JobOrFoodTable'
import {Link} from 'react-router-dom'
import global from '../../constant';

const { Content } = Layout;
const {TabPane} = Tabs;

export default class Common extends React.Component {

    state={

    };

    componentWillMount () {

    };

    componentDidMount () {
        // React.getDOMNode()
    };


    render () {

        let projectName = global.projectName;

        return (

            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff'}}>
                <Breadcrumb>
                    <Breadcrumb.Item><Link to={`/${projectName}`}>首页</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>表格</Breadcrumb.Item>
                    <Breadcrumb.Item>常规</Breadcrumb.Item>
                </Breadcrumb>
                <Tabs size="large" defaultActiveKey="2" style={{marginTop:'0.2rem'}}>
                    <TabPane tab={<span><Icon type="user" />职位</span>} key="1">
                        <JobOrFoodTable tableType="job"/>
                    </TabPane>
                    <TabPane tab={<span><Icon type="profile" />菜系</span>} key="2">
                        <JobOrFoodTable tableType="foodType"/>
                    </TabPane>
                </Tabs>

            </Content>
        );
    }
}

