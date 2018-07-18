import React from 'react';
import { Layout, Breadcrumb, Table } from 'antd';
import {Link} from 'react-router-dom'
import global from '../../constant';
import moment from 'moment';
import {commomAxios} from '../../util/axios'
const { Content } = Layout;


export default class VideoConsult extends React.Component {

    state={
        videoData: [],
        consultData: [],
    };

    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };

    componentDidMount =()=> {
        commomAxios.get("/system/listVideoArticle")
            .then(data => {
                this.setState({ videoData: data.data });
            })
    };

    onExpand = (expanded, record) => {
        commomAxios.get(`/system/listConsult?articleId=${record.id}&articleType=${1}`)
            .then(data => {
                this.setState({ consultData: data.data });
            })
    }


    render () {
        const nestedTable = () => {
            const expandRowRender = () =>{
                const columns = [
                    { title: '发布者', dateIndex: 'publisherName', key: 'publisherName'},
                    { title: '咨询类型', dateIndex: 'title', key: 'title',
                        render: text => {
                            if(text === 0) {
                                return <div>饮食文化</div>
                            }else if(text === 1) {
                                return <div>日常记录</div>
                            }
                        }
                    },
                    { title: '咨询时间', dateIndex: 'publishDate', key: 'publishDate', render: text => <div>{moment(text * 1000).format("YYYY-MM-DD")}</div>},
                ];
                return(
                    <Table
                        columns={columns}
                        dataSource={this.state.consultData}
                        pagination={false}
                    />
                );
            };
            const columns = [
                { title: '标题', dataIndex: 'title', key: 'title'},
                { title: '播放次数', dataIndex: 'playCount', key: 'playCount'},
                { title: '点赞次数', dataIndex: 'admireCount', key: 'admireCount'},
                { title: '视频地址', dataIndex: 'videoUrl', key: 'videoUrl', render: text => <a>{text}</a>},
            ];
            return (
                <Table
                    dataSource={this.state.videoData}
                    columns={columns}
                    expandedRowRender={expandRowRender}
                    onExpand={this.onExpand}
                />
            )
        }


        let projectName = global.projectName;
        return (
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff'}}>
                <Breadcrumb>
                    <Breadcrumb.Item><Link to={`/${projectName}`}>首页</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>表格</Breadcrumb.Item>
                    <Breadcrumb.Item>资讯</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{marginTop: '10px'}}>{nestedTable()}</div>
            </Content>
        );
    }
}