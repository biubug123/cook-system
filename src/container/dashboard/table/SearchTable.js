import React from 'react';
import {Table,Card,Row,Col} from 'antd'
import SearchUserChart from '../chart/SearchUserChart'
import SearchAvgChart from '../chart/SearchAvgChart'


const data = [{
    key: '1',
    ranking: 1,
    keyword: 'New York No. 1 Lake Park',
    userNum:30,
    increase:1.5,
    down:true

}, {
    key: '2',
    ranking: 2,
    keyword: 'London No. 1 Lake Park',
    userNum:20,
    increase:2,
    down:false
}, {
    key: '3',
    ranking: 3,
    keyword: 'Sidney No. 1 Lake Park',
    userNum:34,
    increase:3.6,
    down:true
}];

export default class  extends React.Component {

    state={
        //搜索用户数
        searchUserData:{
            increase:2,
            //是否下降
            down:false,
            //数据
            data: [220, 282, 201, 234, 290, 430, 410]
        },
        //用户平均搜索数
        searchAvgData:{
            increase:20,
            //是否下降
            down:true,
            //数据
            data: [220, 282, 201, 234, 290, 430, 410]
        }
    };

    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };

    componentDidMount () {

        // React.getDOMNode()
    };

    render () {
        const {searchUserData,searchAvgData} = this.state;
        const columns = [{
            title: '排名',
            dataIndex: 'ranking',
            key: 'ranking',
            width:"15rem",
            sorter: (a, b) => a.ranking - b.ranking,
        }, {
            title: '搜索关键词',
            dataIndex: 'keyword',
            key: 'keyword',
            render: text => <a>{text}</a>,
            width:"25rem"
        }, {
            title: '用户数',
            dataIndex: 'userNum',
            key: 'userNum',
            sorter: (a, b) => a.userNum - b.userNum,
        }, {
            title: '周涨幅',
            key: 'increase',
            render: (text, record) => {
                let compareIcon = record.down?"down":"up";
                let color = record.down?"#72c040":"#e33c39";
                return (
                    <div>
                        {record.increase}&nbsp;
                            <i style={{color:color}} className={`anticon anticon-caret-${compareIcon}`}/>
                    </div>
                )
            },
            sorter: (a, b) => a.increase - b.increase,
        }];
        let SearchUserCompare=()=>{
            let compareIcon = searchUserData.down?"down":"up";
            let color = searchUserData.down?"#72c040":"#e33c39";
            return (
                <span style={{color:"#000000"}}>
                    {searchUserData.increase}%<i style={{color:color}} className={`anticon anticon-caret-${compareIcon}`}/>
                </span>
            )
        }
        let SearchAvgCompare=()=>{
            let compareIcon = searchAvgData.down?"down":"up";
            let color = searchAvgData.down?"#72c040":"#e33c39";
            return (
                <span style={{color:"#000000"}}>
                    {searchAvgData.increase}%<i style={{color:color}} className={`anticon anticon-caret-${compareIcon}`}/>
                </span>
            )
        }


        return (
            <div>
                <Row gutter={14} type="flex" justify="space-between">
                    <Col xl={12} lg={24} xm={24} xs={24}>
                        <Card>
                            <Card.Meta description={
                                <div style={{paddingBottom:"2rem"}}>
                                    <div className="cardTitle">搜索用户数&nbsp;<SearchUserCompare/></div>
                                    <SearchUserChart data={searchUserData} style={{width:'88%',height:'20rem'}}/>
                                </div>
                            }/>
                        </Card>
                    </Col>
                    <Col  xl={12} lg={24} xm={24} xs={24}>
                        <Card>
                            <Card.Meta description={
                                <div style={{paddingBottom:"2rem"}}>
                                    <div className="cardTitle">人均搜索次数&nbsp;<SearchAvgCompare/></div>
                                    <SearchAvgChart data={searchAvgData} style={{width:'88%',height:'20rem'}}/>
                                </div>
                            }/>
                        </Card>
                    </Col>
                </Row>
                <Table style={{marginTop:"2rem"}} columns={columns} dataSource={data} />
            </div>

        );
    }
}