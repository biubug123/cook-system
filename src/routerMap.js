import React from 'react'
import {Route,Router,Redirect,Switch} from 'react-router-dom'
import Container from './container/Container'
import LoginPage from './container/LoginPage'
import Article from './component/public/Article'
import global from './constant';

//组件拦截
import requireAuthentication from './util/authenticated'
import history from './history';
//中文
// import zhCN from 'antd/lib/locale-provider/zh_CN';

export default class RouterMap extends React.Component{
	render(){
		//项目名
		let projectName= global.projectName;
		return(
			<Router history={history}>
				<Switch>
                    <Route path={`/${projectName}/login`} component={(LoginPage)}/>
                    <Route path={`/${projectName}`} component={requireAuthentication(Container)}/>
                    <Route path={`/${projectName}-extra/article`} component={requireAuthentication(Article)}/>
					<Redirect to={`/${projectName}`}/>
				</Switch>
			</Router>
		)
	}
}

