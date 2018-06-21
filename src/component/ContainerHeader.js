import React from 'react';
import {Layout,Icon ,Avatar,Dropdown,Menu} from 'antd'
const {Header} = Layout;

export default class ContainerHeader extends React.Component {



    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };

    componentDidMount () {
        // React.getDOMNode()
    };

    render () {
        // 是否收缩
        const {collapsed,toggle} = this.props;

        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <a>1st menu item</a>
                </Menu.Item>
                <Menu.Item key="1">
                    <a>2nd menu item</a>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Divider />
                <Menu.Item key="2">
                    <i className="anticon anticon-logout"></i>
                    <span>&nbsp;&nbsp;退出登录</span>
                </Menu.Item>
            </Menu>
        );

        return (
            <Header style={{ background: '#fff', padding: '0px' }}>
                <Icon
                    className="trigger"
                    type={collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={toggle}
                />
                <Dropdown overlay={menu} placement="bottomRight">
                    <div className="user">
                        <Avatar style={{backgroundColor: '#ff99ff'}} icon="user" />
                        <span style={{marginLeft:'0.45rem'}}>Assert</span>
                    </div>
                </Dropdown>
                <div className="user-icon">
                    <Icon type="search" />
                </div>

            </Header>
        );
    }
}

Header.defaultProps = {

};
