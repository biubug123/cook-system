import React from 'react';
import {Select} from 'antd'
import {commomAxios} from '../../util/axios'

const {Option}= Select;





export default class CommonMultiSelect extends React.Component {

    state={
        data:[]
    };
    selectChange=(value, option)=>{
        const {getValue} = this.props;
        getValue(value);
    }

    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };

    componentDidMount () {
        const {selectType} = this.props;
        if(selectType==="roleSelect"){
            commomAxios.get("/managementApi/getRoleList").then((res)=>{
                console.log(res.data);
                this.setState({
                    data:res.data.data
                })
            })
        }
        // React.getDOMNode()
    };
    

    render () {
        const {data} =this.state;
        const {style} = this.props;
        let OptionData = data.map((item,index)=>{
            return (
                <Option key={item.key}>{item.name}</Option>
            )
        })
        return (
            <React.Fragment>
                <Select
                    labelInValue
                    mode="multiple"
                    size="default"
                    placeholder="请选择角色"
                    onChange={this.selectChange}
                    style={style}
                >
                    {OptionData}
                </Select>
            </React.Fragment>
        );
    }
}