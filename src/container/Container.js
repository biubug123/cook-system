import React from 'react';
import { Layout, Menu, Icon} from 'antd';
import {Route,Link} from 'react-router-dom'
import ContainerHeader from '../component/ContainerHeader'
//图表
import Monitor from './dashboard/Monitor'
import Analyze from './dashboard/Analyze'
//table
import Common from './table/Common'
import Hunt from './table/Hunt'
import Recruit from './table/Recruit'
import global from '../constant';
import VideoConsult from "./table/VideoArticleConsult";
import ImageArticleConsult from "./table/ImageArticleConsult";
//发布
import Advertisement from './release/Advertisement'
import Information from "./release/Information";
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
        let menuData=[{
                "IconType":"anticon anticon-dashboard",
                "menuLabel":"图表",
                "Item": [{
                    "ItemKey": "analyze",
                    "url": `/${projectName}`,
                    "label": "分析页",
                    "component":Analyze
                    },{
                    "ItemKey": "monitor",
                    "url": `/${projectName}/dashBoard/monitor`,
                    "label": "监控页",
                    "component":Monitor
                }]
            }, {
                "IconType":"layout",
                "menuLabel":"表格",
                "Item": [{
                    "ItemKey": "common",
                    "url": `/${projectName}/table/common`,
                    "label": "常规",
                    "component":Common
                },{
                    "ItemKey": "hunt",
                    "url": `/${projectName}/table/hunt`,
                    "label": "求职",
                    "component":Hunt
                },{
                    "ItemKey": "recruit",
                    "url": `/${projectName}/table/recruit`,
                    "label": "招聘",
                    "component":Recruit
                },{
                    "ItemKey": "imageArticleConsult",
                    "url": `/${projectName}/table/imageArticleConsult`,
                    "label": "图文资讯",
                    "component":ImageArticleConsult
                },{
                    "ItemKey": "videoConsult",
                    "url": `/${projectName}/table/videoConsult`,
                    "label": "视频资讯",
                    "component":VideoConsult
                }]
            }, {
                "IconType":"layout",
                "menuLabel":"发布",
                "Item": [{
                    "ItemKey": "advertisement",
                    "url": `/${projectName}/release/advertisement`,
                    "label": "广告",
                    "component":Advertisement
                },{
                    "ItemKey": "information",
                    "url": `/${projectName}/release/information`,
                    "label": "资讯",
                    "component":Information
                }]
            },{
            "IconType":"setting",
            "menuLabel":"管理",
            "Item": [{
                "ItemKey": "user",
                "url": `/${projectName}/manage/user`,
                "label": "用户",
                "component":User
            },{
                "ItemKey": "admin",
                "url": `/${projectName}/manage/admin`,
                "label": "管理员",
                "component":Administrator
            },{
                "ItemKey": "authority",
                "url": `/${projectName}/manage/authority`,
                "label": "权限控制",
                "component":Authority
            }]
        }

        ];
        let SubMenuMaps = menuData.map((item, index) => {
            const menuItem=[];
            item.Item.forEach((k, i) => {
                menuItem.push(<Item key={k.ItemKey}><Link to={k.url}>{k.label}</Link></Item>)
            })
            return(
                <SubMenu key={index}
                    title={<span><Icon type={item.IconType} /><span>{item.menuLabel}</span></span>}
                >
                    {menuItem}
                </SubMenu>
            )
        });
        let RouterMaps = menuData.map((item, index) => {
            const routerMap=[];
            item.Item.forEach((k, i) => {
                if(k.url===`/${projectName}`){
                    routerMap.push(<Route key={k.url} exact path={k.url} component={k.component}/>)
                }else {
                    routerMap.push(<Route key={k.url} path={k.url} component={k.component}/>)
                }

            })
            return(<div key={index}>
                    {routerMap}
                </div>
            )
        });
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
                            {SubMenuMaps}
                        </Menu>
                    </Sider>
                    <Layout>
                        <ContainerHeader collapsed={this.state.collapsed} toggle={this.toggle}/>
                        {RouterMaps}
                    </Layout>
            </Layout>
        );
    }
}

