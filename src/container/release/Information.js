import React from 'react';
import PublicBreadcrumb from '../../component/public/PublicBreadcrumb'
import Simditor from "simditor";
import CommonRoleSelect from '../../component/select/CommonRoleSelect'
import {commomAxios,advertisementDomain} from '../../util/axios'
import qs from 'qs';
import {Layout,Button,Input,Tabs,Upload,Icon,message,Select} from 'antd';

require("simditor/styles/simditor.css");

const { Content } = Layout;
const TabPane = Tabs.TabPane;
const {Option}= Select;

let uploader;
export default class Information extends React.Component {

    state={
        title:"",
        description:"",
        tabKey:"1",
        fileList:[],
        consultType:{key: "0", label: "饮食文化"},
        userInfo:[],
        imageName:""
    };

    componentWillMount () {
        console.log(this.props);

    };

    componentDidMount =()=> {
        this.initEditor();
        this.initVideo();
    };

    //富文本编辑初始化
    initEditor = () => {
        let config = {
            placeholder: "资讯内容",
            defaultImage: 'images/image.png',
            params: {},
            tabIndent: true,
            toolbar: [ //工具条
                'title',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'fontScale',
                'color',
                'link',
                'hr',
                'image',
                'indent',
                'outdent',
                'alignment',
            ],
            upload: {
                url: "http://139.199.86.11:8080/cook/file/consultImageUpload", //文件上传的接口地址
                // params: {
                //     appid: "",
                //     secret: "",
                // }, //指定文件上传接口的额外参数,上传的时候随文件一起提交
                fileKey: 'file', //服务器端获取文件数据的参数名
                connectionCount: 1,//文件上传的个数
                leaveConfirm: '正在上传文件',

            },

            toolbarFloat: true,
            toolbarFloatOffset: 0,
            toolbarHidden: false,
            pasteImage: false,
            cleanPaste: false,
            textarea: document.getElementById("container") //这里textarea标签里的id对应
        };

        this.editor = new Simditor(config);// 初始化编辑器
        this.editor.setValue("");
        this.editor.uploader.on('uploadsuccess', (res,file,mask)=>{
            let {imageName}=this.state;
            //获得上传的文件对象
            let img = file.img;
            console.log(res);
            console.log(file);
            console.log(mask);
            if(mask.code===200){
                message.success("上传成功");
                img.attr('src',advertisementDomain+mask.data.fileName);
                let name=mask.data.fileName;
                imageName+=name+',';
                this.setState({
                    imageName
                })
            }else {
                message.error("图片上传失败,请重新上传");
                img.remove();
            }


        });

        // //监听改变
        // this.editor.on("valuechanged", (e, src) => {
        //
        // });

    }

    //视频上传初始化
    initVideo=()=>{
        uploader = new window.AliyunUpload.Vod({
            //分片大小默认1M，不能小于100K
            partSize: 1048576,
            //并行上传分片个数，默认5
            parallel: 5,
            //网络原因失败时，重新上传次数，默认为3
            retryCount: 3,
            //网络原因失败时，重新上传间隔时间，默认为2秒
            retryDuration: 2,
            // 开始上传
            onUploadstarted:(uploadInfo)=> {
                message.info("开始上传视频……");
                console.log("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
                //上传方式1, 需要根据uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress，如果videoId有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
                // uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId);
                //上传方式2-STS
                this.getStsUpload(0,uploadInfo);

            },
            // 文件上传成功,数据库操作
            onUploadSucceed: (uploadInfo)=> {
                let {title,description,consultType,userInfo} = this.state;
                console.log(uploadInfo);
                //videoId
                // let videoInfo=uploadInfo.videoInfo;
                let videoId = uploadInfo.videoId;
                if (videoId===null){
                    message.error("视频上传失败");
                    return;
                }
                let data={
                    "consultType":consultType.key,
                    "title":title,
                    "userId":userInfo.key,
                    "content":description,
                    "videoId":videoId
                }
                message.success("视频上传成功");
                this.abstractPost("/videoArticle/releaseVideoConsult",data);

            },
            // 文件上传失败
            onUploadFailed: (uploadInfo, code, messages)=> {
                message.error("视频上传失败",messages);
                console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + messages);
            },
            // 文件上传进度，单位：字节
            onUploadProgress:(uploadInfo, totalSize, loadedPercent)=>{
                message.info("上传进度:"+Math.ceil(loadedPercent * 100) + "%");
                console.log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + Math.ceil(loadedPercent * 100) + "%");
            },
            // 上传凭证超时
            onUploadTokenExpired:(uploadInfo)=> {
                console.log("onUploadTokenExpired");
                //从新获取STS临时账号用于恢复上传
                this.getStsUpload(1);
                // uploader.resumeUploadWithSTSToken(accessKeyId, accessKeySecret, secretToken, expireTime);
            },
            //全部文件上传结束
            onUploadEnd:(uploadInfo)=>{
                console.log("onUploadEnd: uploaded all the files");
            }
        });
    }

    //基本的post方法
    abstractPost=(url,data)=>{
        message.info("正在发布……");
        commomAxios.post(url,qs.stringify(data)).then((res)=>{
            let data = res.data;
            if(data.code === 200){
                message.success("发布成功");
                this.editor.setValue("");
                //初始所有值
                this.setState({
                    title:"",
                    description:"",
                    fileList:[],
                    consultType:{key: "0", label: "饮食文化"},
                    userInfo:[],
                    imageName:""
                })
            }

        })
    }

    //图文资讯发布
    publishImageArticle = () => {
        //标题
        let {title,consultType,userInfo,imageName} = this.state;
        //内容
        const content = this.editor.getValue().trim();
        if(title.length===0||content.length===0){
            message.info("标题或详情不得为空");
            return;
        }
        //除去最后一个逗号
        imageName=imageName.substring(0,imageName.length-1);
        let data={
            "consultType":consultType.key,
            "title":title,
            "userId":userInfo.key,
            "content":content,
            "imageName":imageName
        }

        this.abstractPost("/imageArticle/releaseImageTextConsult",data);
        console.log(data);


    };

    //发布视频资讯
    publishVideoArticle = () => {
        //标题
        const {title,description,fileList} = this.state;
        if (fileList.length===0){
            message.info("请选择视频");
            return;
        }
        if(title.length===0||description.length===0){
            message.info("标题或详情不得为空");
            return;
        }
        let userData = '{"Vod":{"Title":"'+title+'","Description":"'+description+'","CateId":"220603863","Tags":"由管理员发布"}}';
        for(var i=0; i<fileList.length; i++) {
            // 逻辑代码
            uploader.addFile(fileList[i], null, null, null, userData);
        }
        //视频上传
        uploader.startUpload();

    };

    //获取stsToken
    getStsUpload=(type,uploadInfo)=>{
        commomAxios.get("/video/getStsToken").then((res)=>{
            let aliKey = res.data.data.credentials;
            if(res.data.code===200){
                console.log("获取sts成功,开始上传");
                if(type===0){
                    //第一次获取ststoken
                    uploader.setSTSToken(uploadInfo, aliKey.accessKeyId, aliKey.accessKeySecret,aliKey.securityToken);
                }else {
                    ////从新获取STS临时账号用于恢复上传
                    uploader.resumeUploadWithSTSToken(aliKey.accessKeyId, aliKey.accessKeySecret,aliKey.securityToken,aliKey.expiration);
                }

            }

        })

    }

    //从子组件获取管理员
    getSysUser=(val)=>{
        this.setState({
            userInfo:val
        })
    }

    render () {
        const {title,description,tabKey,fileList,consultType} = this.state;
        const props = {
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList }) => ({
                    fileList: [...fileList, file],
                }));
                return false;
            },
            accept:"video/*",
            listType:'text',
            fileList: fileList,
            disabled: fileList.length>0
        };
        const SysUserSelect=<CommonRoleSelect getValue={this.getSysUser} style={{width:"15rem"}} selectType="allSysUser"/>;
        const consultTypeSelect=<Select
            labelInValue
            size="default"
            value={consultType}
            placeholder="请选择资讯类型"
            onChange={(value,option)=>{this.setState({consultType:value})}}
            style={{width:"10rem"}}
        >
            <Option value="0">饮食文化</Option>
            <Option value="1">日常记录</Option>
        </Select>
        return (
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff',minHeight:"43rem"}}>
                <PublicBreadcrumb menu="发布" item="资讯"/>
                <Tabs activeKey={tabKey} style={{margin:"1rem 0"}} onChange={(e)=>{this.setState({tabKey:e})}}>
                    <TabPane tab="图文资讯" key="1">
                        <Button type="primary" style={{marginBottom:"1rem"}} onClick={this.publishImageArticle}>发布图文资讯</Button>
                        <div>{consultTypeSelect}</div>
                        <div style={{margin:"1rem 0 0 0"}}>{SysUserSelect}</div>
                        <Input style={{margin:"1.5rem 0"}} addonBefore="标题" value={title}  onChange={(e)=>{this.setState({title:e.target.value})}}/>
                        <textarea id="container" autoFocus></textarea>
                    </TabPane>
                    <TabPane tab="视频资讯" key="2">
                        <Button type="primary" style={{marginBottom:"1rem"}} onClick={this.publishVideoArticle}>发布视频资讯</Button>
                        &nbsp;&nbsp;
                        <Upload {...props}>
                            <Button disabled={fileList.length>0}>
                                <Icon type="rocket"/>选择视频
                            </Button>
                        </Upload>
                        <div>{consultTypeSelect}</div>
                        <div style={{marginTop:"1.5rem"}}>{SysUserSelect}</div>
                        <Input addonBefore="视频标题" value={title} style={{margin:"1.5rem 0 0 0"}} onChange={(e)=>{this.setState({title:e.target.value})}}/>
                        <Input addonBefore="视频轻描述" value={description} style={{margin:"1.5rem 0 1rem 0"}} onChange={(e)=>{this.setState({description:e.target.value})}}/>
                    </TabPane>
                </Tabs>
            </Content>
        );
    }
}