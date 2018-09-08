import React from 'react';
import {Row,Input,Avatar,Button,List,Spin,Icon,message} from 'antd'
import ContainerHeader from '../ContainerHeader'
import history from '../../history'
import timeUtil from '../../util/timeUtil'
import {commomAxios} from "../../util/axios";
import qs from 'qs';

const { TextArea } = Input;

export default class  extends React.Component {

    state={
        commentValue:"",
        //评论区加载
        commentLoading:false,
        //正在加载更多
        loadingMore: false,
        //是否还能加载评论
        showLoadingMore: true,
        commentPageNum:1,
        //评论区内容
        commentData:[]
    };

    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };

    componentDidMount () {
        let data=this.props.location.state;
        //图文html设置
        if(data.articleType===0){
            document.getElementById("content").innerHTML = data.content;
        }
        this.requestGet();
    };

    requestGet=()=>{
        let {commentPageNum,showLoadingMore}=this.state;
        let {articleId}=this.props.location.state;
        commomAxios.get(`/system/commentList/${articleId}/${commentPageNum}`).then((res)=>{
            let data=res.data.data;
            if(data.isLastPage){
                showLoadingMore=false;
            }
            this.setState({
                commentPageNum:data.pageNum,
                commentData:data.list,
                showLoadingMore
            })
        })
    }

    //基本的post方法
    abstractPost=(url,data)=>{
        commomAxios.post(url,qs.stringify(data)).then((res)=>{
            let data = res.data;
            if(data.code === 200){
                message.success("操作成功");
                this.requestGet();
            }else {
                message.error("操作失败");
            }

        })
    }

    //添加评论
    insertComment=()=>{
        const{commentValue}=this.state;
        let {articleId}=this.props.location.state;
        console.log(commentValue);
        let data={
            "articleId":articleId,
            "content":commentValue
        }
        this.abstractPost("/system/addComment",data);
    }

    admireComment=(item)=>{
        let data={
            "commentId":item.commentId,
            "articleId":item.articleId
        }
        this.abstractPost("/system/commentAdmire",data);
    }
    deleteComment=(item)=>{
        console.log(item);
        let data={
            "commentId":item.commentId
        }
        this.abstractPost("/system/deleteComment",data);
    }


    render () {
        let data=this.props.location.state;
        let {showLoadingMore,commentLoading,loadingMore,commentData}=this.state;

        const loadMore = showLoadingMore ? (
            <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
                {loadingMore && <Spin />}
                {!loadingMore && <Button onClick={this.requestGet}>点击加载</Button>}
            </div>
        ) : null;
        return (
            <React.Fragment>
                <ContainerHeader toggle={()=>{history.go(-1)}}/>
                <div style={{margin:"2.5rem 0"}}>
                    <Row type="flex" justify="center">
                        <div style={{fontSize:"46px",fontWeight:"bold",width:"20rem"}}>{data.title}</div>
                    </Row>
                    <Row type="flex" justify="center" style={{marginTop:"1rem"}}>
                        <Avatar src={data.headImageName} />
                        {/*<div style={{float:"left",borderRadius:"3rem",width:"3rem",height:'3rem',backgroundSize:"cover",backgroundImage:`url(${data.headImageName})`}}/>*/}
                        <div style={{float:"right",marginLeft:"0.5rem",color:"#969696"}}>
                            <h3>{data.publisherName}</h3>
                            &nbsp;
                            <span>{timeUtil.formatDateTime(data.publishDate)}</span>
                            &nbsp;
                            <span>浏览次数:{data.browseCount}</span>
                            &nbsp;
                            <span>点赞次数:{data.admireCount}</span>
                        </div>
                    </Row>
                </div>
                <Row type="flex" justify="center" style={{margin:"8rem 0"}}>
                    {
                        data.articleType === 0 ?
                            <div id="content" style={{width: "60%"}}></div>
                            :
                            <video width="60%" height="auto" controls>
                                <source src={data.videoUrl} type="video/mp4"/>
                            </video>
                    }
                </Row>
                <div style={{margin:"auto",position:"relative",width:"50%",height:"10rem"}}>
                    <TextArea style={{height:"10rem"}}  value={this.state.commentValue} rows={4} placeholder="评论内容..." onChange={(e)=>{this.setState({commentValue:e.target.value})}}/>
                    <Button type="primary" onClick={this.insertComment} style={{position:"absolute",right:"0",bottom:"-3rem"}}>评论</Button>
                </div>
                <Row type="flex" justify="center" style={{margin:"8rem 0"}}>
                    <List
                        style={{width:"50%"}}
                        className="demo-loadmore-list"
                        loading={commentLoading}
                        itemLayout="horizontal"
                        loadMore={loadMore}
                        dataSource={commentData}
                        renderItem={item => (
                            <List.Item actions={[<a onClick={()=>this.admireComment(item)}><Icon type="like-o"/>&nbsp;{item.admireCount}</a>, <a onClick={()=>this.deleteComment(item)}>删除</a>]}>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.headImgName} />}
                                    title={<a href="https://ant.design">{item.username}</a>}
                                    description={timeUtil.formatDateTime(item.commentDate)}
                                />
                                <div>{item.content}</div>
                            </List.Item>
                        )}
                    />
                </Row>





            </React.Fragment>

        );
    }
}