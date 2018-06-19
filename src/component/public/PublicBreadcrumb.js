import React from 'react';
import {Breadcrumb} from 'antd'
import global from "../../constant";
import {Link} from 'react-router-dom'

export default class PublicBreadcrumb extends React.Component {


    render () {
        const {menu,item} = this.props;

        let projectName = global.projectName;
        return (
            <Breadcrumb>
                <Breadcrumb.Item><Link to={`/${projectName}`}>首页</Link></Breadcrumb.Item>
                <Breadcrumb.Item>{menu}</Breadcrumb.Item>
                <Breadcrumb.Item>{item}</Breadcrumb.Item>
            </Breadcrumb>
        );
    }
}