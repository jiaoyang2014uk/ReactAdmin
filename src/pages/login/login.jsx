import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

//登陆的路由组件
export default class Login extends Component{

    onFinish = async (values) => {
        const {username, password} = values
        const result = await reqLogin(username, password)
        if(result.status === 0){//登录成功
            message.success('登录成功')
            const user = result.data
            memoryUtils.user = user //保存在内存中
            storageUtils.saveUser(user)//保存到local中
            //跳转到管理界面(不需要回退)
            this.props.history.replace('/')
        } else{//登录失败
            message.error(result.msg)
        }
      };

    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };
      //密码自定义验证
      validatorPwd  = (rule, value) => {
        if(!value){
            return Promise.reject('密码必须输入')
        } else if(value.length<4){
            return Promise.reject('密码长度不能小于4位')
        } else if(value.length>12){
            return Promise.reject('密码长度不能大于12位')
        } else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            return Promise.reject('密码必须是英文、数字或下划线组成')
        } else {
            return Promise.resolve()
        }
      }

    render(){
        //如果用户已经登录，自动调整到管理界面
        const user = memoryUtils.user
        if(user && user._id){
            return <Redirect to='/'/>
        }
        return(
            <div className='login'>
                <header className='login-header'>
                    <img src= {logo} alt = 'logo'/>
                    <h1>React项目： 后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登录</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                        >
                        <Form.Item
                            name="username"
                            // 用户名/密码的合法性要求： 1.必须输入； 2必须大于4位； 3必须小于12位；4必须是英文、数字或下划线组成
                            rules={[
                                { required: true, whitespace: true, message: '用户名必须输入' },
                                { min: 4, message: '用户名至少4位' },
                                { max: 12, message: '用户名最多12位' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                            ]}
                            initialValue='admin'
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            // 用户名/密码的合法性要求： 1.必须输入； 2必须大于4位； 3必须小于12位；4必须是英文、数字或下划线组成
                            rules={[{ validator: this.validatorPwd }]}
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            type="password"
                            placeholder="密码"
                            />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登陆
                            </Button>
                        </Form>
                </section>
            </div>
        )
    }
}