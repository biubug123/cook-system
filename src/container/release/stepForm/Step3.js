import React, {Component} from 'react';
import {Button, Col, Form, Input, Radio, Checkbox} from 'antd'


const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
    },
};

const formItemLayout2 = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};

const options = [
    { label: '限制发送速度', value: 'limitSpeed'},
    { label: '消息触发器', value: 'messageTriger'}
]

const remindWay= [{label: '震动', value: 'shock'}, {label: '呼吸灯', value: 'light'}];

class Step3 extends Component {

    handleSubmit = (e) =>{
        e.preventDefault();
        const { getFieldValue } = this.props.form;
        console.log("表单内容" + getFieldValue());
        this.props.history.push(`/cookSystem/release/messagePush`);
    }

    lastStep = () => {
        this.props.history.push(`/cookSystem/release/messagePush/target`);
    }


    render() {

        const { getFieldDecorator, getFieldValue } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item label={"后续动作"} {...formItemLayout}>
                    {getFieldDecorator('action', {initialValue: 'runApp'})(
                        <Radio.Group>
                            <Radio value="runApp">打开应用</Radio>
                            <Radio value="toUrl">打开链接</Radio>
                            <Radio value="toAppoint">打开指定页面</Radio>
                            <Radio value="customAction">自定义行为</Radio>
                        </Radio.Group>
                    )}
                </Form.Item>
                {
                    ( () => {
                        switch(getFieldValue(`action`)) {
                            case 'toUrl':
                                return <Form.Item {...formItemLayout2} style={{ width: '40%' }} label={"URL"}>
                                    {getFieldDecorator(`url`)(
                                        <Input placeholder={"填写以https或者http开头的地址"} />
                                    )}
                                </Form.Item>
                            case 'toAppoint':
                                return <Form.Item {...formItemLayout2}  style={{ width: '40%' }} label={"Activity"}>
                                    {getFieldDecorator(`Activity`)(
                                        <Input placeholder={"填写完整的包名和Activity"} />
                                    )}
                                </Form.Item>
                            case 'customAction':
                                return <Form.Item {...formItemLayout2}  style={{ width: '40%' }}>
                                    {getFieldDecorator(`customAction`)(
                                        <Input.TextArea rows={5} />
                                    )}
                                </Form.Item>
                            default: return null;
                        }
                    })()
                }
                <Form.Item label={"系统通道"} {...formItemLayout}>
                    {getFieldDecorator('sysPass',{
                        valuePropName: 'checked',
                        initialValue: false
                    })(
                        <Checkbox style={{width : '30%'}}>MIUI、EMUI、Flyme系统设备离线转为系统下发</Checkbox>
                    )}
                    {getFieldValue(`sysPass`) === true ?
                        <Form.Item label={"打开指定页面"} {...formItemLayout}>
                            {getFieldDecorator(`sysAppointAge`)(
                                <Input placeholder={"填写Activity完整的包路径"} style={{width : '30%'}} />
                            )}
                        </Form.Item>
                        :
                        <div></div>
                    }
                </Form.Item>
                <Form.Item label={"提醒方式"} {...formItemLayout}>
                    {getFieldDecorator('remindSound', {initialValue: 'default'})(
                        <Radio.Group>
                            <Radio value="default">系统声音</Radio>
                            <Radio value="none">无</Radio>
                            <Radio value="customMusic">自定义声音</Radio>
                        </Radio.Group>
                    )}
                    {getFieldValue(`remindSound`) === `customMusic` ?
                        <Form.Item {...formItemLayout}>
                            {getFieldDecorator(`soundFile`)(
                                <Input placeholder={"位于RAW文件夹内的声音文件，如: um_sour"} style={{width : '40%'}} />
                            )}
                        </Form.Item>
                        :
                        null
                    }
                </Form.Item>
                <Form.Item {...formItemLayout}>
                    <Col  span={4} push={2}>
                        {getFieldDecorator(`remindWay`)(
                            <Checkbox.Group options={remindWay}/>
                        )}
                    </Col>
                </Form.Item>
                <Form.Item label={"高级设置"} {...formItemLayout}>
                    {getFieldDecorator(`advanceSetting`)(
                        <Checkbox.Group options={options} />
                    )}
                    {getFieldValue(`advanceSetting`)&&getFieldValue(`advanceSetting`).indexOf(`limitSpeed`) !== -1 ?
                        <div>每秒最多发送
                            {getFieldDecorator(`messageNumber`, {initialValue: 1000})(
                                <Input style={{width: '10%'}}/>
                            )}条消息（1000-10000）
                        </div>
                        :
                        null
                    }
                    {getFieldValue(`advanceSetting`)&&getFieldValue(`advanceSetting`).indexOf(`messageTriger`) !== -1 ?
                        <div>
                            “点击”消息时添加标签
                            {getFieldDecorator(`clickMessage`)(
                                <Input style={{width: '40%'}} placeholder={"多个标签以逗号分隔，总长度不超过256个字符"} />
                            )}
                            <br />“忽略”消息时添加标签
                            {getFieldDecorator(`ignoreMessage`)(
                                <Input style={{width: '40%'}} placeholder={"多个标签以逗号分隔，总长度不超过256个字符"} />
                            )}
                        </div>
                        :
                        null
                    }
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={this.lastStep}>上一步</Button>
                    <Button type="primary" style={{marginLeft: 10}} htmlType="submit">完成</Button>
                </Form.Item>
            </Form>
        )
    }
}

export default Step3 = Form.create({})(Step3)