import React from 'react';
import {Layout,Icon,Tabs} from 'antd';
import EditableTable from '../../component/table/EditableTable'
import PublicBreadcrumb from '../../component/public/PublicBreadcrumb'
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

        let jobTab = global.editable_job_tab;
        let foodTab = global.editable_food_tab;

        return (

            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff'}}>
                <PublicBreadcrumb menu="表格" item="常规"/>
                <Tabs size="large" defaultActiveKey="1" style={{marginTop:'0.2rem'}}>
                    <TabPane tab={<span><Icon type="user" />职位</span>} key="1">
                        <EditableTable tableType={jobTab}/>
                    </TabPane>
                    <TabPane tab={<span><Icon type="profile" />菜系</span>} key="2">
                        <EditableTable tableType={foodTab}/>
                    </TabPane>
                </Tabs>

            </Content>
        );
    }
}

