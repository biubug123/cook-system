import React from 'react';
import { Layout, Breadcrumb, Table, Form, Row, Col, Select, Input, Button, Icon} from 'antd'
import {Link} from 'react-router-dom'
import global from "../../constant";
import moment from 'moment';
const { Content } = Layout;
const FormItem = Form.Item;
const { Option } = Select;


const colums = [{
    title: `招聘方`,
    dataIndex: `publisherName`,
    key: `publisherName`
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
    dataIndex: `foodTypeName`,
    key: `foodTypeName`
},{
    title: `招聘人数`,
    dataIndex: `recruitPeopleNum`,
    key: `recruitPeopleNum`
},{
    title: `发布时间`,
    dataIndex: `publishDate`,
    key: `publishDate`,
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.publishDate - b.publishDate,
    render: time => <div>{moment(time * 1000).format("YYYY-MM-DD")}</div>
},{
    title: `学历要求`,
    dataIndex: `education`,
    key: `education`
},{
    title: `工作经验要求`,
    dataIndex: `experienceRequire`,
    key: `experienceRequire`
},{
    title: `浏览人数`,
    dataIndex: `browseCount`,
    key: `browseCount`,
    sorter: (a, b) => a.browseCount - b.browseCount,
},{
    title: `申请人数`,
    dataIndex: `applyPeopleNum`,
    key: `applyPeopleNum`,
    sorter: (a, b) => a.applyPeolpleNum - b.applyPeolpleNum,
},]

function onChange(sorter) {
    console.log('params', sorter);
}
class Recruit extends React.Component {

    state={
        dataSource: [],
        selectedRowKeys: [],
        expand: false,
    };


    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };


    componentDidMount () {
        fetch(`http://localhost:8080/system/listRecruit`, {method: 'GET'})
            .then(response => response.json())
            .then(data =>{
                this.setState({ dataSource: data });
            });
    };

    onSelectChange = (selectedRowKeys) => {
        console.log("选中" + selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    }


    renderSearchForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="规则编号">
                            {getFieldDecorator('no')(<Input placeholder="请输入" />)}
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


    render () {

        const { selectedRowkeys } = this.state;
        const rowSelection = {
            selectedRowkeys,
            onChange: this.onSelectChange,
        };
        const { getFieldDecorator } = this.props.form;
        let projectName = global.projectName;
        return (

            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 800 }}>
                <Breadcrumb>
                    <Breadcrumb.Item><Link to={`/${projectName}`}>首页</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>表格</Breadcrumb.Item>
                    <Breadcrumb.Item>招聘</Breadcrumb.Item>
                </Breadcrumb>
                <div>
                    <Form
                        className="ant-advanced-search-form"
                        onSubmit={this.handleSearch}
                    >
                        <Row gutter={24}>
                            <Col span={8} key={0}>
                                <FormItem label={`岗位`}>
                                    {getFieldDecorator(`field`, {
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
                                <FormItem label={`发布单位`}>
                                    {getFieldDecorator(`field-${1}`, {
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
                                <Button type="primary" htmlType="submit">Search</Button>
                                <Button style={{ marginLeft: 8 }}>
                                    Clear
                                </Button>
                                <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                                    Collapse <Icon type={this.state.expand ? 'up' : 'down'} />
                                </a>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <Table dataSource={this.state.dataSource}  expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>} columns={colums} rowSelection={rowSelection} />
            </Content>
        );
    }
}

export default Recruit = Form.create({})(Recruit);