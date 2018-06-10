import React from 'react'
import '../css/login.css'
import axios from 'axios'
import {loginAxios} from '../util/axios'
import qs from 'qs';
import { Form, Icon, Input, Button} from 'antd';

import history from '../history';

const FormItem = Form.Item;
class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        console.log(values.userName,values.password);
          let postData = qs.stringify({
              username:values.userName,
              password:values.password
          })
          // loginAxios.post("/user/login",postData).then(function(response){
          //
          //     let code = response.data.code;
          //     console.log(response);
          //     if(code===200){
          //       let token = response.data.data.value;
          //       console.log("成功");
          //       sessionStorage.setItem("token",token);
          //       history.push('/cookSystem');
          //     }
          // })
          history.push('/cookSystem');
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
    	<div className="login">
      <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
              <div className="login-logo">Cook</div>
          </FormItem>
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="账号" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
        </FormItem>
      </Form>
      </div>
    );
  }
}

const LoginPage = Form.create()(NormalLoginForm);

export default LoginPage;