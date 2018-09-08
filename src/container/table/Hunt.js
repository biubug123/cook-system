import React from 'react';
import { Layout, Table, Form, Row, Col, Select, Input, Button, Icon} from 'antd'
import moment from 'moment';

import {commomAxios} from '../../util/axios'
import PublicBreadcrumb from '../../component/public/PublicBreadcrumb'
const { Content } = Layout;
const FormItem = Form.Item;
const { Option } = Select;

const colums = [{
    title: `求职者`,
    dataIndex: `userName`,
    key: `userName`
},{
    title: `性别`,
    dataIndex: `sex`,
    key: `sex`
},{
    title: `职位`,
    dataIndex: `jobName`,
    key: `jobName`
},{
    title: `薪酬`,
    dataIndex: `salary`,
    key: `salary`
},{
    title: `菜系`,
    dataIndex: `foodType`,
    key: `foodType`
},{
    title: `学历`,
    dataIndex: `education`,
    key: `education`
},{
    title: `发布时间`,
    dataIndex: `huntDate`,
    key: `huntDate`,
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.hunDate - b.hunDate,
    render: time => <div>{moment(time * 1000).format("YYYY-MM-DD")}</div>
},{
    title: `工作经验`,
    dataIndex: `workYear`,
    key: `workYear`
},{
    title: `工作地点`,
    dataIndex: `workArea`,
    key: `workArea`
},{
    title: `浏览人数`,
    dataIndex: `browseCount`,
    key: `browseCount`,
    sorter: (a, b) => a.browseCount - b.browseCount,
}]



class Hunt extends React.Component {

    state={
        dataSource: [],
        selectedRowKeys: [],
    };

    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };

    componentDidMount= ()=> {
        commomAxios.get(`/system/listHunt`)
            .then(data =>{
                this.setState({ dataSource: data.data });
            });
    };

    onSelectChange = (selectedRowKeys) => {
        console.log("选中" + selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    buildParam = (params) => {
        return Object.keys(params).filter(key => params[key]).map(key => `${key}=${params[key]}`).join(`&`);
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            commomAxios.get(`system/listHunt?${this.buildParam(values)}`)
                .then(data =>{
                    this.setState({ dataSource: data.data });
                })
        });
    };

    renderSearchForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="规则编号">
                            {getFieldDecorator('no')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="使用状态">
                            {getFieldDecorator('status')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="0">关闭</Option>
                                    <Option value="1">运行中</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    handleReset = () => {
        this.props.form.resetFields();
    }

    render () {
        const { selectedRowkeys } = this.state;

        const rowSelection = {
            selectedRowkeys,
            onChange: this.onSelectChange,
        };
        const { getFieldDecorator } = this.props.form;

        return (

            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                <PublicBreadcrumb menu="表格" item="求职"/>
                <div>
                    <Form
                        className="ant-advanced-search-form"
                        onSubmit={this.handleSearch}
                    >
                        <Row gutter={24}>
                            <Col span={8} key={0}>
                                <FormItem label={`求职者`}>
                                    {getFieldDecorator(`userName`, {
                                        rules: [{
                                            required: false,
                                            message: 'Input something!',
                                        }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={1}>
                                <FormItem label={`工作区域`}>
                                    {getFieldDecorator(`workArea`, {
                                        rules: [{
                                            required: false,
                                            message: 'Input something!',
                                        }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6} style={{ textAlign: 'right', marginTop: '40px' }}>
                                <Button type="primary" htmlType="submit">查询</Button>
                                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                    重置
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <Table dataSource={this.state.dataSource} columns={colums} rowSelection={rowSelection} />

            </Content>
        );
    }
}

export default Hunt = Form.create({})(Hunt);