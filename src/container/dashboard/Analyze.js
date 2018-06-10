import React from 'react';
import {Layout,Card, Col, Row} from 'antd'
import VisitorVolumeChart from './chart/VisitorVolumeChart'
import SimpleChart from './chart/SimpleChart'
import '../../css/Analyze.css'


const {Meta} =Card;
const { Content } = Layout;


export default class Analyze extends React.Component {

    state={

    };

    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };

    componentDidMount () {

    };


    render () {


        return (
            <div className="analyze">
                {/*卡片组*/}
                <Row gutter={14} type="flex" justify="space-between">
                    <Col className="analyzeCard"  xl={8} lg={24} xm={24} xs={24}>
                        <Card title={
                            <div className="cardContent">
                                <div className="cardTitle">总销售额</div>
                                <div className="content">
                                    <span>￥123,3123,321</span>
                                </div>
                            </div>
                        }>
                            <Meta
                                description="日均销售额￥12,423"
                            />
                        </Card>
                    </Col>
                    <Col className="analyzeCard" xl={8} lg={24} xm={24} xs={24}>
                        <Card title={
                            <div className="cardContent">
                                <div className="cardTitle">访问量</div>
                                <div className="content">
                                    <span>8,846</span>
                                    <VisitorVolumeChart style={{width:'92%',height:'15rem'}}/>
                                </div>
                            </div>
                        }> <Meta
                            description="日访问量 1,234"
                        />
                        </Card>
                    </Col>
                    <Col className="analyzeCard"  xl={8} lg={24} xm={24} xs={24}>
                        <Card title={
                            <div className="cardContent">
                                <div className="cardTitle">支付笔数</div>
                                <div className="content">
                                    <span>6560</span>
                                    <SimpleChart style={{width:'92%',height:'15rem'}}/>
                                </div>
                            </div>
                        }> <Meta
                            description="日访问量 1,234"
                        />
                        </Card>
                    </Col>
                </Row>
                <Content style={{ margin: '24px 0', background: '#fff', minHeight: '58rem' }}>

                </Content>
            </div>

        );

    }
}
