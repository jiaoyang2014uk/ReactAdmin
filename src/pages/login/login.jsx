import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import { Form, Input, Button, message, Icon } from 'antd';
import {connect} from 'react-redux'
import './login.less'
import logo from '../../assets/images/logo.png'
// import {reqLogin} from '../../api'
// import memoryUtils from '../../utils/memoryUtils'
// import storageUtils from '../../utils/storageUtils'
import {login} from '../../redux/actions'

//登陆的路由组件
class Login extends Component{

    handleSubmit = (event) => { 
        // 阻止事件的默认行为 
        event.preventDefault() 
        // 对所有表单字段进行检验 
        this.props.form.validateFields(async (err, values) => { 
            // 检验成功 
            if (!err) { 
                // console.log('提交登陆的 ajax 请求', values) 
                const {username, password} = values 

                //调用分发异步action的函数，发登录异步请求，有了结果后更新状态
                this.props.login(username, password)

                /*
                const result = await reqLogin(username, password) 
                // console.log('login()', result) 
                if(result.status === 0) { 
                    // 提示登录成功 
                    message.success('登录成功', 2) 
                    // 保存用户登录信息 
                    const user = result.data
                    memoryUtils.user = user
                    storageUtils.saveUser(user)
                    // 跳转到主页面 （不需要回退到登录）
                    this.props.history.replace('/home') 
                } else { 
                        // 登录失败, 提示错误 
                        message.error(result.msg) 
                    } 
                    */
                } else { 
                    console.log('检验失败!') 
                } 
            });
        }
      //密码自定义验证
    validatePwd = (rule, value, callback) => { 
        console.log('validatePwd()', rule, value) 
        if(!value) { 
              callback('密码必须输入') 
        } else if (value.length<4) { 
                callback('密码长度不能小于 4 位') 
        } else if (value.length>12) { 
            callback('密码长度不能大于 12 位') 
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) { 
            callback('密码必须是英文、数字或下划线组成') 
        } else { 
            callback() // 验证通过 
        }
        // callback('xxxx') // 验证失败, 并指定提示的文本 
    }

    render(){
        //如果用户已经登录，自动调整到管理界面
        // const user = memoryUtils.user
        const user = this.props.user
        if(user && user._id){
            return <Redirect to='/home'/>
        }

        const errorMsg = this.props.user.errorMsg

        // 得到具强大功能的 form 对象 
        const form = this.props.form 
        const { getFieldDecorator } = form;
        return(
            <div className='login'>
                <header className='login-header'>
                    <img src= {logo} alt = 'logo'/>
                    <h1>React项目： 后台管理系统</h1>
                </header>
                <section className='login-content'>
                <div className={user.errorMsg ? 'error-msg show' : 'error-msg'}>{user.errorMsg}</div>
                    <h2>用户登录</h2>
                    <Form
                        className="login-form"
                        onSubmit={this.handleSubmit}
                        >
                        <Form.Item
                        >
                            { getFieldDecorator('username', { // 配置对象: 属性名是特定的一些名称 
                            // 声明式验证: 直接使用别人定义好的验证规则进行验证 
                            rules: [ 
                                { required: true, whitespace: true, message: '用户名必须输入' }, 
                                { min: 4, message: '用户名至少 4 位' }, { max: 12, message: '用户名最多 12 位' }, 
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划 线组成' }, 
                            ],
                            initialValue: 'admin' //指定初始值 
                        })(
                        <Input 
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                        placeholder="用户名" /> 
                        ) }
                        </Form.Item>
                        <Form.Item
                        >
                            { getFieldDecorator('password', { 
                                rules: [ { validator: this.validatePwd } ] 
                                })(
                                <Input 
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                                type="password"
                                placeholder="密码" 
                                /> ) }
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
const WrapLogin = Form.create()(Login)

export default connect(
    state => ({user: state.user}),
    {login}
)(WrapLogin)
