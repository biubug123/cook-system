import React from 'react';
import { Layout, Breadcrumb, Table, Form, Row, Col, Select, Input, Button, Icon} from 'antd'
import { Link } from 'react-router-dom'
import global from "../../constant";
import moment from 'moment';
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
}
    ,{
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

function onChange(sorter) {
    console.log('params', sorter);
}

class Hunt extends React.Component {

    state={
        dataSource: [],
        selectedRowKeys: [],
    };

    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };

    componentDidMount () {
        fetch(`http://localhost:8080/system/listHunt`, {method: 'GET'})
            .then(response => response.json())
            .then(data =>{
                this.setState({ dataSource: data });
            });
    };

    onSelectChange = (selectedRowKeys) => {
        console.log("选中" + selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    };

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

            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                <Breadcrumb>
                    <Breadcrumb.Item><Link to={`/${projectName}`}>首页</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>表格</Breadcrumb.Item>
                    <Breadcrumb.Item>求职</Breadcrumb.Item>
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
                <Table dataSource={this.state.dataSource} columns={colums} rowSelection={rowSelection} />

            </Content>
        );
    }
}

export default Hunt = Form.create({})(Hunt);