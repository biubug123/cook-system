import React from 'react';
import { Layout, Table, Form, Row, Col, Input, Button} from 'antd'
import moment from 'moment';
import {commomAxios} from '../../util/axios'
import PublicBreadcrumb from '../../component/public/PublicBreadcrumb'
const { Content } = Layout;
const FormItem = Form.Item;


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


class Recruit extends React.Component {

    state={
        dataSource: [],
        selectedRowKeys: [],
        expand: false,
    };


    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };


    componentDidMount =()=> {
        commomAxios.get(`/system/listRecruit`)
            .then(data =>{
                console.log(data.data);
                this.setState({ dataSource: data.data });
            });
    };

    onSelectChange = (selectedRowKeys) => {
        console.log("选中" + selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    buildParam = (params) => {
        return Object.keys(params).filter(key => params[key]).map(key => `${key}=${params[key]}`).join(`&`);
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            commomAxios.get(`/system/listRecruit?${this.buildParam(values)}`)
                .then(data => {
                    this.setState({dataSource: data.data});
                })
        })
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

            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: '1050px' }}>
                <PublicBreadcrumb menu="表格" item="招聘"/>
                <div>
                    <Form
                        className="ant-advanced-search-form"
                        onSubmit={this.handleSearch}
                    >
                        <Row gutter={24}>
                            <Col span={8} key={0}>
                                <FormItem label={`岗位`}>
                                    {getFieldDecorator(`jobName`, {
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
                                    {getFieldDecorator(`publisherName`, {
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
                                <Button type="primary" htmlType="submit">搜索</Button>
                                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                    重置
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <Table rowKey={record => record.id} dataSource={this.state.dataSource}  expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>} columns={colums} rowSelection={rowSelection} />
            </Content>
        );
    }
}

export default Recruit = Form.create({})(Recruit);