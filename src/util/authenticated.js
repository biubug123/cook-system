import React from 'react'
import history from '../history'

export default function requireAuthentication(Component) {
    // 组件有已登陆的模块 直接返回 (防止从新渲染)
    if (Component.AuthenticatedComponent) {
        console.log("组件有已登陆的模块");
        return Component.AuthenticatedComponent
    }

    // 创建验证组件
    class AuthenticatedComponent extends React.Component {

        state = {
            authorize: false,
        };

        componentWillMount() {
            this.checkAuth();
        }

        componentWillReceiveProps(nextProps) {
            this.checkAuth();
        }

        checkAuth() {
            console.log("验证");
            // if(sessionStorage.getItem("token")){
            //     //验证 TODO
            //     this.setState({authorize:true});
            // }else {
            //     history.push("/cookSystem/login");
            // }
            this.setState({authorize:true});
        }

        render() {
            //若已登录，放行这个组件
            if (this.state.authorize) {
                return <Component {...this.props}/>
            }
            return ''
        }
    }

    //直接返回
    Component.AuthenticatedComponent = AuthenticatedComponent
    return Component.AuthenticatedComponent

}