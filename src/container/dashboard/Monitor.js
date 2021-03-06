import React from 'react';
import {Layout,Breadcrumb} from 'antd'
import {Link} from 'react-router-dom'
import global from "../../constant";
const { Content } = Layout;

export default class Monitor extends React.Component {

    state={

    };

    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };

    componentDidMount () {
        // React.getDOMNode()
    };

    render () {
        let projectName = global.projectName;
        return (

            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                <Breadcrumb>
                    <Breadcrumb.Item><Link to={`/${projectName}`}>首页</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>图表</Breadcrumb.Item>
                    <Breadcrumb.Item>监视页</Breadcrumb.Item>
                </Breadcrumb>
            </Content>
        );
    }
}