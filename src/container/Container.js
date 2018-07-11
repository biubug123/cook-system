import React from 'react';
import { Layout, Menu, Icon} from 'antd';
import {Route,Link} from 'react-router-dom'
import ContainerHeader from '../component/ContainerHeader'
//图表
import Monitor from './dashboard/Monitor'
import Advertisement from './dashboard/Advertisement'
import Analyze from './dashboard/Analyze'
//table
import Common from './table/Common'
import Hunt from './table/Hunt'
import Recruit from './table/Recruit'
import global from '../constant';
import VideoConsult from "./table/VideoArticleConsult";
import ImageArticleConsult from "./table/ImageArticleConsult";

//manage
import Administrator from './manage/Administrator'
import User from './manage/User'
import Authority from './manage/Authority'


const { Sider } = Layout;
const {SubMenu,Item} = Menu;


export default class Container extends React.Component {

    state={
        collapsed: false,
        selectKey: 'analyze'
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    componentWillMount = () =>{
        let {pathname} = this.props.location;
        //截取最后一个字符用户定位选定的key
        let index = pathname.lastIndexOf('/');
        let key = pathname.substring(index+1);
        console.log(key);
        if(key === "cookSystem"){
            key = "analyze";
        }
        this.setState({
            selectKey: key
        })
    };

    componentDidMount () {
        // React.getDOMNode()
    };

    componentWillUnmount () {
        // remove event listeners (Flux Store, WebSocket, document, etc.)
    };




    render () {
        let projectName= global.projectName;
        return (
            // 主要布局
            <Layout style={{height:'100%'}}>
                {/*侧边栏*/}
                        <Sider
                        trigger={null}
                        collapsible
                        collapsed={this.state.collapsed}
                    >
                        {/*侧边栏logo*/}
                        <div className="logo">Cook-System</div>
                        {/*侧边栏菜单*/}

                        <Menu theme="dark" mode="inline" defaultSelectedKeys={[this.state.selectKey]}>
                            {/*图表菜单集合*/}
                            <SubMenu
                                title={<span><Icon type="anticon anticon-dashboard" /><span>图表</span></span>}
                            >
                                <Item key="analyze"><Link to={`/${projectName}`}>分析页</Link></Item>
                                <Item key="monitor"><Link to={`/${projectName}/dashBoard/monitor`}>监控页</Link></Item>
                                <Item key="advertisement"><Link to={`/${projectName}/dashBoard/advertisement`}>广告管理</Link></Item>
                            </SubMenu>
                            {/*表格菜单集合*/}
                            <SubMenu
                                title={<span><Icon type="layout" /><span>表格</span></span>}
                            >

                                <Item key="common"><Link to={`/${projectName}/table/common`}>常规</Link></Item>
                                <Item key="hunt"><Link to={`/${projectName}/table/hunt`}>求职表</Link></Item>
                                <Item key="recruit"><Link to={`/${projectName}/table/recruit`}>招聘表</Link></Item>
                                <Item key="imageArticleConsult"><Link to={`/${projectName}/table/imageArticleConsult`}>图文咨询表</Link></Item>
                                <Item key="videoConsult"><Link to={`/${projectName}/table/videoConsult`}>视频咨询表</Link></Item>
                            </SubMenu>
                            {/*管理菜单集合*/}
                            <SubMenu
                                title={<span><Icon type="setting" /><span>管理</span></span>}
                            >
                                <Item key="user"><Link to={`/${projectName}/manage/user`}>用户</Link></Item>
                                <Item key="admin"><Link to={`/${projectName}/manage/admin`}>管理员</Link></Item>
                                <Item key="authority"><Link to={`/${projectName}/manage/authority`}>权限控制</Link></Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout>
                        <ContainerHeader collapsed={this.state.collapsed} toggle={this.toggle}/>
                        {/*图表*/}
                        <Route exact path={`/${projectName}`} component={Analyze}/>
                        <Route path={`/${projectName}/dashBoard/monitor`} component={Monitor}/>
                        <Route path={`/${projectName}/dashBoard/advertisement`} component={Advertisement}/>
                        {/*表格*/}
                        <Route path={`/${projectName}/table/common`} component={Common}/>
                        <Route path={`/${projectName}/table/imageArticleConsult`} component={ImageArticleConsult}/>
                        <Route path={`/${projectName}/table/videoConsult`} component={VideoConsult}/>
                        <Route path={`/${projectName}/table/hunt`} component={Hunt}/>
                        <Route path={`/${projectName}/table/recruit`} component={Recruit}/>
                        {/*管理*/}
                        <Route path={`/${projectName}/manage/user`} component={User}/>
                        <Route path={`/${projectName}/manage/admin`} component={Administrator}/>
                        <Route path={`/${projectName}/manage/authority`} component={Authority}/>
                    </Layout>
            </Layout>
        );
    }
}

