import React, {Component} from 'react';
import {Button, Form, Icon, Input, message, Radio, Row, Tooltip, Upload, Col} from 'antd';

const FormItem = Form.Item;
const RadioGroup  = Radio.Group;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
};

const props = {
    name: 'file',
    multiple: true,
    action: '//jsonplaceholder.typicode.com/posts/',
    onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

class Step1 extends Component {

    nextStep = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.history.push({pathname: `/cookSystem/release/messagePush/target`});
            } else {
                // 错误处理
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { getFieldValue } = this.props.form;
        return (
                <Form onSubmit={this.nextStep}>
                    <FormItem label={"任务描述"} {...formItemLayout}>
                        {getFieldDecorator('description', {
                            rules: [{ required: true, message: '请输入任务描述', whiteSpace: true}],
                        })(
                            <Input placeholder="任务描述" />
                        )}
                    </FormItem>
                    <FormItem label={"展示样式"} {...formItemLayout}>
                        {getFieldDecorator('style',{ initialValue: 'default'})(
                            <RadioGroup>
                                <Radio value="default">默认样式</Radio>
                                <Radio value="customized">定制样式&nbsp;
                                    <Tooltip title="定制本条通知在通知栏中的展示样式，需要前提在APK中设置好相应的样式，只允许输入0-99间的整数。">
                                        <Icon type="question-circle" theme="outlined" />
                                    </Tooltip>
                                </Radio>
                                <Radio value="picture">图片</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    {
                        ( () =>{
                            switch(getFieldValue(`style`)) {
                                case 'customized':
                                    return (
                                        <FormItem label={"通知栏样式编号"} {...formItemLayout}>
                                            {getFieldDecorator('styleNumber')(
                                                <Input />
                                            )}
                                        </FormItem>
                                    )
                                case `picture` :
                                    return (
                                        <FormItem {...formItemLayout}>
                                            <Upload
                                                action='//jsonplaceholder.typicode.com/posts/'
                                                listType='picture'
                                                defaultFileList={[{
                                                    uid: '-1',
                                                    name: 'xxx.png',
                                                    status: 'done',
                                                    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                                                    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                                                }]}
                                            >
                                                <Button>
                                                    <Icon type="upload" /> Upload
                                                </Button>
                                            </Upload>
                                        </FormItem>

                                    )
                                default: return null;
                            }
                        })()
                    }
                    <FormItem label={"图标"} {...formItemLayout}>
                        {getFieldDecorator('icon', { initialValue: 'default'})(
                            <RadioGroup>
                                <Radio value="default">默认图标</Radio>
                                <Radio value="custom">自定义图标</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    {getFieldValue(`icon`) === "custom" ?
                        <Row>
                            <Col push={2} span={18}>
                                <FormItem {...formItemLayout}>
                                    {getFieldDecorator('iconFile', { initialValue: 'inner' })(
                                        <RadioGroup>
                                            <Radio value="inner">应用内图标文件</Radio>
                                            <Radio value="upload">上传图标文件</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                {getFieldValue(`iconFile`) === "inner" ?
                                        <div>
                                            <FormItem label={"大图标文件"} {...formItemLayout}>
                                                {getFieldDecorator('bigIcon')(
                                                    <Input placeholder={"位于drawable文件内"} />
                                                )}
                                            </FormItem>
                                            <FormItem label={"小图标文件"} {...formItemLayout}>
                                                {getFieldDecorator('smallIcon')(
                                                    <Input placeholder={"位于drawable文件内"} />
                                                )}
                                            </FormItem>
                                        </div>
                                        :
                                        <div>
                                            <FormItem label={"大图标文件"} {...formItemLayout}>
                                                {getFieldDecorator('bigIcon')(
                                                    <Upload
                                                        action='//jsonplaceholder.typicode.com/posts/'
                                                        listType='picture'
                                                        defaultFileList={[{
                                                            uid: '-1',
                                                            name: 'xxx.png',
                                                            status: 'done',
                                                            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                                                        }]}
                                                    >
                                                        <Button>
                                                            <Icon type="upload" /> Upload
                                                        </Button>
                                                    </Upload>
                                                )}
                                            </FormItem>
                                            <FormItem label={"小图标文件"} {...formItemLayout}>
                                                {getFieldDecorator('smallIcon')(
                                                    <Input placeholder={"位于drawable文件内"} />
                                                )}
                                            </FormItem>
                                        </div>
                                }
                            </Col>
                        </Row>
                        :
                       null
                    }
                    <FormItem label={"标题"} {...formItemLayout}>
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '请输入标题'}],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label={"内容"} {...formItemLayout}>
                        {getFieldDecorator('content', {
                            rules: [{ required: true, message: '请输入内容'}],
                        })(
                            <Input.TextArea rows={8} placeholder={"最大400个字符"} />
                        )}
                    </FormItem>
                    <FormItem label={"是否展开"} {...formItemLayout}>
                        {getFieldDecorator('isOpen')(
                            <RadioGroup>
                                <Radio value="disabled">禁用</Radio>
                                <Radio value="bigPicture">大图</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    {getFieldValue(`isOpen`) === `bigPicture` ?
                                 <FormItem {...formItemLayout}>
                                    <Upload.Dragger {...props}>
                                        <p className="ant-upload-drag-icon">
                                            <Icon type="inbox" />
                                        </p>
                                        <p className="ant-upload-text">点击或者拖拽图片上传</p>
                                        <p className="ant-upload-hint">推荐图大小：宽700px，高400px，200kb以下</p>
                                    </Upload.Dragger>
                                 </FormItem>
                        :
                        null
                    }
                    <FormItem {...formItemLayout} >
                        <Button type="primary" htmlType="submit">下一步</Button>
                    </FormItem>
                </Form>
        )
    }
}

export default Step1 = Form.create({})(Step1);