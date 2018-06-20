import React from 'react';
import { Layout, Menu, Icon} from 'antd';
import {Route,Link} from 'react-router-dom'
import ContainerHeader from '../component/ContainerHeader'
//图表
import Monitor from './dashboard/Monitor'
import Work from './dashboard/Work'
import Analyze from './dashboard/Analyze'
//table
import Common from './table/Common'
import Consult from './table/Consult'
import Hunt from './table/Hunt'
import Recruit from './table/Recruit'
import global from '../constant';
import VideoConsult from "./table/VideoArticleConsult";
import ImageArticleConsult from "./table/ImageArticleConsult";

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
                                <Item key="work"><Link to={`/${projectName}/dashBoard/work`}>工作台</Link></Item>
                            </SubMenu>
                            {/*表格菜单集合*/}
                            <SubMenu
                                title={<span><Icon type="layout" /><span>表格</span></span>}
                            >
                                <Item key="Common"><Link to={`/${projectName}/table/common`}>常规</Link></Item>
                                <Item key="imageArticleConsult"><Link to={`/${projectName}/table/imageArticleConsult`}>图文咨询表</Link></Item>
                                <Item key="videoConsult"><Link to={`/${projectName}/table/videoConsult`}>视频咨询表</Link></Item>
                                <Item key="Hunt"><Link to={`/${projectName}/table/hunt`}>求职表</Link></Item>
                                <Item key="Recruit"><Link to={`/${projectName}/table/recruit`}>招聘表</Link></Item>
                            </SubMenu>
                            {/*管理菜单集合*/}
                            <Item key="3">
                                <Icon type="upload" />
                                <span>管理</span>
                            </Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <ContainerHeader collapsed={this.state.collapsed} toggle={this.toggle}/>
                        {/*图表*/}
                        <Route exact path={`/${projectName}`} component={Analyze}/>
                        <Route path={`/${projectName}/dashBoard/monitor`} component={Monitor}/>
                        <Route path={`/${projectName}/dashBoard/work`} component={Work}/>
                        {/*表格*/}
                        <Route path={`/${projectName}/table/common`} component={Common}/>
                        <Route path={`/${projectName}/table/imageArticleConsult`} component={ImageArticleConsult}/>
                        <Route path={`/${projectName}/table/videoConsult`} component={VideoConsult}/>
                        <Route path={`/${projectName}/table/Hunt`} component={Hunt}/>
                        <Route path={`/${projectName}/table/recruit`} component={Recruit}/>
                    </Layout>
            </Layout>
        );
    }
}

