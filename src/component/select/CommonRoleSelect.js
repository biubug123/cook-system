import React from 'react';
import {Select} from 'antd'
import {commomAxios} from '../../util/axios'

const {Option}= Select;





export default class CommonRoleSelect extends React.Component {

    state={
        data:[]
    };

    selectChange=(value, option)=>{
        const {getValue} = this.props;
        getValue(value,option);
    }

    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };

    componentDidMount () {
        const{selectType} = this.props;
        if(selectType==="allRole"){
            commomAxios.get("/managementApi/getRoleList").then((res)=>{
                console.log(res.data);
                this.setState({
                    data:res.data.data
                })
            })
        }else if(selectType==="allSysUser"){
            commomAxios.get("/managementApi/getAllAdmin").then((res)=>{
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
        const {style,selectType} = this.props;
        let OptionData = data.map((item,index)=>{
            return (
                <Option key={item.key}>{selectType==="allRole"?item.name:item.accountNum}</Option>
            )
        })
        return (
            <React.Fragment>
                <Select
                    labelInValue
                    size="default"
                    placeholder={selectType==="allRole"?"请选择角色":"请选择发布该咨询的管理员账号"}
                    onChange={this.selectChange}
                    style={style}
                >
                    {OptionData}
                </Select>
            </React.Fragment>
        );
    }
}