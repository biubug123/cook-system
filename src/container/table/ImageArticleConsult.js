import React from 'react';
import { Layout, Table } from 'antd';
import {commomAxios} from '../../util/axios'
import PublicBreadcrumb from '../../component/public/PublicBreadcrumb'
import history from '../../history'
import global from "../../constant";
import timeUtil from '../../util/timeUtil'
const { Content } = Layout;


//项目名
let projectName= global.projectName;
export default class ImageArticleConsult extends React.Component {

    state={
        imageArticleData: [],
        consultData: [],
        pageNum:1,
        loading:true,
        pagination:{
            onChange:(page,pageSize)=>{
            let pager = { ...this.state.pagination };
            const {pageNum}=this.state;
            pager.current = page;
            commomAxios.get(`/imageArticle/listImageArticle/${pageNum}`).then((res)=>{
                let data = res.data.data;
                this.setState({
                    imageArticleData: data.list,
                    loading:false,
                    pagination: pager,
                })

            })
        }
        }
    };

    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };

    componentDidMount =()=> {
        let {pagination}=this.state;
        commomAxios.get("/imageArticle/listImageArticle/1").then((res)=> {
            let data=res.data.data;
            console.log(data);
            //数据总数
            pagination.total = data.total;
            //每页条数
            pagination.pageSize = data.pageSize;
            //当前页数
            pagination.current = data.pageNum;
            pagination.lastPage = data.lastPage;
                this.setState({
                    imageArticleData: data.list ,
                    pagination,
                    loading:false,
                });
            })
    };

    onExpand = (expanded, record) => {
        commomAxios.get(`/system/listConsult?articleId=${record.id}&articleType=${0}`)
            .then(data => {
                this.setState({consultData: data.data});
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
                ];
                return(
                    <Table
                        loading={this.state.loading}
                        columns={columns}
                        dataSource={this.state.consultData}
                        pagination={false}
                    />
                );
            };
            const columns = [
                { title: '标题', dataIndex: 'title', key: 'title'},
                { title: '发布者', dataIndex: 'publisherName', key: 'publisherName'},
                { title: '浏览次数', dataIndex: 'browseCount', key: 'browseCount'},
                { title: '点赞次数', dataIndex: 'admireCount', key: 'admireCount'},
                { title: '发布时间', dateIndex: 'publishDate', key: 'publishDate', render: (record) => {
                    return(
                        <div>{timeUtil.formatDateTime(record.publishDate)}</div>
                    )}},
                { title: '详情', dataIndex: 'details', key: 'details',
                    render:(text,record)=>{
                     let path={
                         pathname:`/${projectName}-extra/article`,
                         state:record
                     }
                        return(
                            <a target="_blank" onClick={()=>{history.push(path)}}>详情</a>
                        )
                    }
                },
            ];
            return (
                <Table
                    loading={this.state.loading}
                    rowKey={record => record.id}
                    dataSource={this.state.imageArticleData}
                    columns={columns}
                    expandedRowRender={expandRowRender}
                    onExpand={this.onExpand}
                />
            )
        }

        return (
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff'}}>
                <PublicBreadcrumb menu="表格" item="图文"/>
                <div style={{marginTop: '10px'}}>{nestedTable()}</div>
            </Content>
        );
    }
}