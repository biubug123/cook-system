import React,{ Component } from 'react';
import { Layout, Steps, Row, Col } from 'antd';
import PublicBreadcrumb from '../../../component/public/PublicBreadcrumb'
import { Switch, Route, Redirect } from 'react-router-dom';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';


const { Content } = Layout;
const { Step } = Steps;
const projectName = "cookSystem";

const routes = [
    {
        key:  'basic',
        path: `/${projectName}/release/messagePush/basic`,
        component:  Step1,
    },{
        key:  'target',
        path: `/${projectName}/release/messagePush/target`,
        component: Step2,
    },{
        key:  'follow-up',
        path: `/${projectName}/release/messagePush/follow-up`,
        component: Step3,
    },
]
export default class StepForm extends Component {

    getCurrentStep = () => {
        const { pathname } = this.props.location;
        const pathList = pathname.split('/');
        switch(pathList[pathList.length - 1]) {
            case 'basic':
                return 0;
            case 'target':
                return 1;
            case 'follow-up':
                return 2;
            default:
                return 0;
        }
    }

    render() {
        return (
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                <PublicBreadcrumb menu="发布" item="消息推送"/>
                <div style={{marginTop: '15px'}}>
                    <Row gutter={24}>
                        <Col span={14} key={0}>
                            <Steps current={this.getCurrentStep()}>
                                <Step title="基础内容" />
                                <Step title="目标人群" />
                                <Step title="后续行为" />
                            </Steps>
                        </Col>

                    </Row>
                    <Row style={{margin: '20px 0px 0px 0px'}}>
                        <Switch>
                            {routes.map(item => (
                                <Route
                                    key={item.key}
                                    path={item.path}
                                    component={item.component}
                                />
                            ))}
                            <Redirect exact from={"/cookSystem/release/messagePush"} to={"/cookSystem/release/messagePush/basic"} />
                        </Switch>
                    </Row>
                </div>
            </Content>
        )
    }
}

