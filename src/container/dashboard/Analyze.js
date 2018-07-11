import React from 'react';
import {Layout,Card, Col, Row,Tabs,Radio} from 'antd'
import MarketChart from './chart/MarketChart'
import PageViewChart from './chart/PageViewChart'
import PayMentChart from './chart/PayMentChart'
import SearchTable from './table/SearchTable'
import '../../css/Analyze.css'


const {Meta} =Card;
const { Content } = Layout;
const {TabPane} = Tabs;


export default class Analyze extends React.Component {

    state={
        //访问量操作按钮
        pageViewValue:"week",
        marketData: {
            //周同比
            weekCompare:20,
            //是否下降
            weekDown:false,
            //日环比
            daySequential:10,
            //是否下降
            daySequentialDown:true,
            //数据
            data: [220, 282, 201, 234, 290, 430, 410]
        },
        payMentData:{
            //周同比
            weekCompare:15,
            //是否下降
            weekDown:false,
            //日环比
            daySequential:2,
            //是否下降
            daySequentialDown:true,
            data:[10, 52, 200, 334, 390, 330, 220],
        }
    };

    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };

    componentDidMount () {

    };



    render () {
        const {pageViewValue,marketData,payMentData} = this.state;
        const pageView = <Radio.Group value={pageViewValue} onChange={(e)=>{this.setState({
            pageViewValue:e.target.value
        })}}>
            <Radio.Button value="week">本周</Radio.Button>
            <Radio.Button value="month">本月</Radio.Button>
            <Radio.Button value="year">全年</Radio.Button>
        </Radio.Group>;
         let MarketCompare=()=>{
            let weekCompareIcon = marketData.weekDown?"down":"up";
            let daySequentialIcon = marketData.daySequential?"down":"up";
            return (
                <div style={{marginTop:"1rem",marginLeft:"1rem"}}>
                    <span>周同比</span>&nbsp;{marketData.weekCompare}%<i style={{color:"#e33c39"}} className={`anticon anticon-caret-${weekCompareIcon}`}/>
                    &nbsp;&nbsp;
                    <span>日环比</span>&nbsp;{marketData.daySequential}%<i style={{color:"#72c040"}} className={`anticon anticon-caret-${daySequentialIcon}`}/>
                </div>
            )
        }
        let PayMentCompare=()=>{
            let weekCompareIcon = payMentData.weekDown?"down":"up";
            let daySequentialIcon = payMentData.daySequential?"down":"up";
            return (
                <div style={{marginTop:"1rem",marginLeft:"1rem"}}>
                    <span>周同比</span>&nbsp;{payMentData.weekCompare}%<i style={{color:"#e33c39"}} className={`anticon anticon-caret-${weekCompareIcon}`}/>
                    &nbsp;&nbsp;
                    <span>日环比</span>&nbsp;{payMentData.daySequential}%<i style={{color:"#72c040"}} className={`anticon anticon-caret-${daySequentialIcon}`}/>
                </div>
            )
        }
        return (
            <div className="analyze">
                {/*卡片组*/}
                <Row gutter={14} type="flex" justify="space-between">
                    <Col className="analyzeCard"  xl={12} lg={24} xm={24} xs={24}>
                        <Card title={
                            <div className="cardContent">
                                <div className="cardTitle">总销售额</div>
                                <div className="content">
                                    {/*销售图标*/}
                                    <MarketChart data={marketData} style={{width:'92%',height:'20rem'}}/>
                                    <MarketCompare/>
                                </div>
                            </div>
                        }>
                            <Meta
                                description="日均销售额￥12,423"
                            />
                        </Card>
                    </Col>
                    <Col className="analyzeCard"  xl={12} lg={24} xm={24} xs={24}>
                        <Card title={
                            <div className="cardContent">
                                <div className="cardTitle">总支付笔数</div>
                                <div className="content">
                                    {/*支付图表*/}
                                    <PayMentChart data={payMentData} style={{width:'92%',height:'20rem'}}/>
                                    <PayMentCompare/>
                                </div>
                            </div>
                        }> <Meta
                            description="日均支付笔数 1,234"
                        />
                        </Card>
                    </Col>
                </Row>
                {/*访问量*/}
                <Content style={{ margin: '24px 0', padding: 24, background: '#fff', minHeight: '40rem' }}>
                    <Tabs tabBarExtraContent={pageView}>
                        <TabPane tab="访问量" key="1">
                            {/*//访问量chart*/}
                            <PageViewChart style={{width:'100%',height:'30rem'}} pageviewvalue={pageViewValue}/>
                        </TabPane>
                    </Tabs>
                </Content>
                {/*热门搜索*/}
                <Card title="线上热门搜索" style={{marginBottom:"3rem",minHeight: '55rem'}}>
                    <SearchTable/>
                </Card>
            </div>

        );

    }
}
