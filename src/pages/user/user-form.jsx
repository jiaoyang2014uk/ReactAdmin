import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select } from 'antd';
const Item = Form.Item
const Option = Select.Option

//添加修改用户的form组件
class UserForm extends Component{

    static propTypes = {
        setForm: PropTypes.func.isRequired,//传递form对象的函数
        roles: PropTypes.array.isRequired,
        user: PropTypes.object,
    }

    componentWillMount() { 
        //将form对象通过setform传递父组件
        this.props.setForm(this.props.form) 
    }
    
    render(){
        const {roles} = this.props
        const user = this.props.user || {}
        const {getFieldDecorator} = this.props.form
        //指定item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 },//左侧label的宽度
            wrapperCol: { span: 15 },//右侧包裹的宽度
          };
        return(
            <Form  {...formItemLayout}
            >
                <Item label='用户名'
                >
                    { getFieldDecorator('username', { 
                        initialValue: user.username
                        })(
                        <Input placeholder='请输入用户名'/> 
                        ) 
                    }
                </Item>
                {user._id? null:
                <Item label='密码'
                >
                    { getFieldDecorator('password', { 
                        initialValue: user.password
                        })(
                        <Input placeholder='请输入密码' type='password'/> 
                        ) 
                    }
                </Item>
                }
                <Item label='手机号'
                >
                    { getFieldDecorator('phone', {
                        initialValue: user.phone 
                        })(
                        <Input placeholder='请输入手机号'/> 
                        ) 
                    }
                </Item>
                <Item label='邮箱'
                >
                    { getFieldDecorator('email', {
                        initialValue: user.email 
                        })(
                        <Input placeholder='请输入邮箱'/> 
                        ) 
                    }
                </Item>
                <Item label='角色'
                >
                    { getFieldDecorator('role_id', { 
                        initialValue: user.role_id
                        })(
                        <Select placeholder='请选择角色'>
                            {
                            roles.map(role=><Option value={role._id} key={role._id}>{role.name}</Option>)
                            }
                        </Select>
                        ) 
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(UserForm)