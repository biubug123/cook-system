import React, {Component} from 'react';
import {Button, Col, Form, Icon, Input, Radio, Row, Select, DatePicker, TimePicker } from 'antd'
import './stepForm.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};

const condition = [
    {
        key: 'edition',
        value: '版本',
    },{
        key: 'channel',
        value: '渠道',
    },{
        key: 'sysLanguage',
        value: '系统语言',
    },{
        key: 'country',
        value: '国家和地区',
    },{
        key: 'province',
        value: '省份',
    },{
        key: 'activity',
        value: '用户活跃度',
    },{
        key: 'model',
        value: '机型',
    },{
        key: 'label',
        value: '标签',
    }
]

const Option = Select.Option;

class Step2 extends Component {

    state = {
        firstDate: '',
        endStart: true,
        formValue: ''
    }


    nextStep = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.setState({form: Object.assign({},values, this.state.formValue)})
                this.props.history.push(`/cookSystem/release/messagePush/follow-up`);
            } else {
                // 错误处理
            }
        })
    }

    lastStep = () => {
        this.props.history.push(`/cookSystem/release/messagePush/basic`);
    }


    handleCondition = (condition) =>{
        const { form } = this.props;
        const keys = form.getFieldValue(`keys`);
        if(keys.indexOf(condition) !== -1) {
            form.setFieldsValue({ keys: keys.filter(key => key !== condition) })
            return ;
        }
        form.setFieldsValue({
            keys: keys.concat(condition)
        })
    }

    remove = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };

    disabledStartTime = (current) => {

        return  current > moment().subtract(1, 'd').add(+7,'day') || current < moment().subtract(1,'day')
    }

    disabledEndTime = (current) => {
        const startDate = moment(this.state.firstDate).format("D");
        const endDate = (7 - (startDate - 7));
        return current < moment(this.state.firstDate) || current > moment(this.state.firstDate).add(endDate,'day')
    }

    saveStartTime = (current) => {
        this.setState({ firstDate: current, endStart: false });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const buttonGroup = condition.map(item => {
            return (
                <Button onClick={() => this.handleCondition(item.value)} key={item.key} style={{marginLeft: '5px'}}>
                    <Icon type="plus" />{item.value}
                </Button>
            )
        });
        getFieldDecorator('keys', { initialValue: [] })
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            return (
                <Form.Item
                    label={`${keys[index]}`}
                    required={false}
                    key={k}
                >
                    {k === '版本' ?
                        <div>
                            {getFieldDecorator(`select${k}`)(
                                <Select style={{ width: '10%'}}>
                                    <Option value="yes">是</Option>
                                    <Option value="no">否</Option>
                                    <Option value="large">大于等于</Option>
                                    <Option value="small">小于</Option>
                                </Select>
                            )}
                            {getFieldDecorator(`name${k}`)(
                                <Select style={{ width: '40%', marginLeft: 8 }} mode={"multiple"}/>
                            )}
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                onClick={() => this.remove(keys[keys.length - 1 - index])}
                            />
                        </div>
                        :
                        ( () => {
                            switch(k) {
                                case '渠道':
                                    return <div>
                                        {getFieldDecorator(`selet${k}`)(
                                            <Select style={{ width: '10%'}}>
                                                <Option value="yes">是</Option>
                                                <Option value="no">否</Option>
                                            </Select>
                                        )}
                                        {getFieldDecorator(`name${k}`)(
                                            <Select style={{ width: '40%', marginLeft: 8 }} />
                                        )}
                                        <Icon
                                            className="dynamic-delete-button"
                                            type="minus-circle-o"
                                            onClick={() => this.remove(keys[keys.length - 1 - index])}
                                        />
                                    </div>
                                case '系统语言':
                                    return <div>
                                        {getFieldDecorator(`selet${k}`)(
                                            <Select style={{ width: '10%'}}>
                                                <Option value="yes">是</Option>
                                                <Option value="no">否</Option>
                                            </Select>
                                        )}
                                        {getFieldDecorator(`name${k}`)(
                                            <Select style={{ width: '40%', marginLeft: 8 }} />
                                        )}
                                        <Icon
                                            className="dynamic-delete-button"
                                            type="minus-circle-o"
                                            onClick={() => this.remove(keys[keys.length - 1 - index])}
                                        />
                                    </div>
                                case '国家和地区' :
                                    return <div>
                                        {getFieldDecorator(`selet${k}`)(
                                            <Select style={{ width: '10%'}}>
                                                <Option value="yes">是</Option>
                                                <Option value="no">否</Option>
                                            </Select>
                                        )}
                                        {getFieldDecorator(`name${k}`)(
                                            <Select style={{ width: '40%', marginLeft: 8 }} />
                                        )}
                                        <Icon
                                            className="dynamic-delete-button"
                                            type="minus-circle-o"
                                            onClick={() => this.remove(keys[keys.length - 1 - index])}
                                        />
                                    </div>
                                case '省份':
                                    return <div>
                                        {getFieldDecorator(`selet${k}`)(
                                            <Select style={{ width: '10%'}}>
                                                <Option value="yes">是</Option>
                                                <Option value="no">否</Option>
                                            </Select>
                                        )}
                                        {getFieldDecorator(`name${k}`)(
                                            <Select style={{ width: '40%', marginLeft: 8 }} />
                                        )}
                                        <Icon
                                            className="dynamic-delete-button"
                                            type="minus-circle-o"
                                            onClick={() => this.remove(keys[keys.length - 1 - index])}
                                        />
                                    </div>
                                case '机型':
                                    return <div>
                                        {getFieldDecorator(`selet${k}`)(
                                            <Select style={{ width: '10%'}}>
                                                <Option value="yes">是</Option>
                                                <Option value="no">否</Option>
                                            </Select>
                                        )}
                                        {getFieldDecorator(`name${k}`)(
                                            <Select style={{ width: '40%', marginLeft: 8 }} />
                                        )}
                                        <Icon
                                            className="dynamic-delete-button"
                                            type="minus-circle-o"
                                            onClick={() => this.remove(keys[keys.length - 1 - index])}
                                        />
                                    </div>
                                default: return null;
                            }
                        })()
                    }
                </Form.Item>

            );
        });

        return (
            <Form onSubmit={this.nextStep}>
                <Form.Item label={"目标人群"} {...formItemLayout}>
                    {getFieldDecorator('targetPeople', {initialValue: 'all'})(
                        <Radio.Group>
                            <Radio value="all">全部用户</Radio>
                            <Radio value="part">部分用户</Radio>
                            <Radio value="single">独立用户</Radio>
                            <Radio value="special">特定用户</Radio>
                        </Radio.Group>
                    )}
                </Form.Item>
                {
                    ( () =>{
                        switch(getFieldValue(`targetPeople`)) {
                            case `part`:
                                return (
                                    <Row>
                                        <Col span={16} push="4">
                                            普通筛选条件
                                            <hr />
                                            {formItems}
                                            {buttonGroup}
                                        </Col>
                                    </Row>
                                );
                            case `single` :
                                return (
                                    <Form.Item
                                        label="Device Token"
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator(`deviceToken`)(
                                            <Input style={{ width: '40%'}} />
                                        )}
                                    </Form.Item>
                                );
                            case `special`:
                                return (
                                    <Form.Item
                                        label="Device Token"
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator(`Alias`)(
                                            <Select style={{ width: '10%'}} />
                                        )}
                                        {getFieldDecorator(`userId`)(
                                            <Select style={{ width: '40%', marginLeft: 8 }} mode={"taglist"} />
                                        )}
                                    </Form.Item>
                                );
                            default: return null;
                        }
                    })()
                }
                <Form.Item label={"推送时间"} {...formItemLayout}>
                    {getFieldDecorator('pushRadio', {initialValue: 'immediately'})(
                        <Radio.Group onChange={() => {this.setState({ endStart: true })}}>
                            <Radio value="immediately">立即推送</Radio>
                            <Radio value="setTime">定时推送</Radio>
                            <Radio value="rePush">重复推送</Radio>
                        </Radio.Group>
                    )}
                </Form.Item>
                {( () => {
                    switch(getFieldValue(`pushRadio`)) {
                        case 'immediately':
                            return (
                                <Form.Item {...formItemLayout}>
                                    {getFieldDecorator(`pushDate`)(
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            disabledDate={this.disabledStartTime}
                                        />
                                    )}
                                    {getFieldDecorator(`pushTime`)(
                                        <TimePicker/>
                                    )}&nbsp;之前在线设备可接受到消息
                                </Form.Item>
                            );
                        case 'setTime':
                            return(
                                <Form.Item {...formItemLayout}>
                                    {getFieldDecorator(`startDate`)(
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            disabledDate={this.disabledStartTime}
                                            onChange={this.saveStartTime}
                                            style={{marginLeft: 8}}
                                        />
                                    )}
                                    {getFieldDecorator(`startTime`)(
                                        <TimePicker style={{marginLeft: 8}}/>
                                    )}&nbsp;至&nbsp;
                                    {getFieldDecorator(`endDate`)(
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            disabledDate={this.disabledEndTime}
                                            disabled={this.state.endStart}
                                        />
                                    )}
                                    {getFieldDecorator(`endTime`)(
                                        <TimePicker
                                            style={{marginLeft: 8}}
                                            disabled={this.state.endStart}
                                        />
                                    )}&nbsp;
                                    内在线设备可接受到消息
                                </Form.Item>
                            );
                        case 'rePush':
                            return (
                                <Form.Item {...formItemLayout}>
                                    {getFieldDecorator(`startDate`)(
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            disabledDate={this.disabledStartTime}
                                            onChange={this.saveStartTime}
                                            style={{marginLeft: 8, width: '12%'}}
                                        />
                                    )}
                                    {getFieldDecorator(`startTime`)(
                                        <TimePicker style={{marginLeft: 8, width: '9%'}}/>
                                    )}&nbsp;至&nbsp;
                                    {getFieldDecorator(`endDate`)(
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            disabledDate={this.disabledEndTime}
                                            disabled={this.state.endStart}
                                            style={{marginLeft: 8, width: '12%'}}
                                        />
                                    )}
                                    {getFieldDecorator(`endTime`)(
                                        <TimePicker
                                            style={{marginLeft: 8, width: '9%'}}
                                            disabled={this.state.endStart}
                                        />
                                    )}
                                    {getFieldDecorator(`timeOrWeek`,({initialValue: 'everyweek'}))(
                                        <Select style={{marginLeft : 8, width: "8%"}}>
                                            <Option value="everyweek">每周</Option>
                                            <Option value="everyday">每天</Option>
                                        </Select>
                                    )}
                                    {getFieldValue(`timeOrWeek`) === `everyweek`?
                                        <div style={{width: '13%'}}>
                                            {getFieldDecorator(`day`)(
                                                <Select>
                                                    <Option value="Monday">星期一</Option>
                                                    <Option value="Tuesday">星期二</Option>
                                                    <Option value="Wednesday">星期三</Option>
                                                    <Option value="Thursday">星期四</Option>
                                                    <Option value="Friday">星期五</Option>
                                                    <Option value="Saturday">星期六</Option>
                                                    <Option value="Sunday">星期天</Option>
                                                </Select>
                                            )}
                                            {getFieldDecorator(`dayTime`)(
                                                <TimePicker
                                                    style={{marginLeft : 8}}
                                                />
                                            )}
                                            &nbsp;&nbsp;&nbsp;消息有效期为三天
                                        </div>
                                        :
                                        <div>
                                            {getFieldDecorator(`dayTime`)(
                                                <TimePicker
                                                    style={{marginLeft : 8}}
                                                />
                                            )}
                                            &nbsp;消息有效期为一天
                                        </div>
                                    }

                                </Form.Item>
                            )
                        default: return null;
                    }})()
                }

                <Form.Item {...formItemLayout} >
                    <Button type="primary" onClick={this.lastStep}>上一步</Button>
                    <Button type="primary" style={{marginLeft: 10}} htmlType="submit">下一步</Button>
                </Form.Item>
            </Form>
        )
    }
}

export default Step2 = Form.create({})(Step2)