import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Input,  } from 'antd';
const Item = Form.Item

//添加分类的form组件
class AddForm extends Component{

    static propTypes = {
        categorys: PropTypes.array.isRequired,//一级分类数组
    }

    componentWillMount() { 
        //将form对象通过setform传递父组件
        this.props.setForm(this.props.form) 
    }
    
    render(){
        const {getFieldDecorator} = this.props.form
        //指定item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 },//左侧label的宽度
            wrapperCol: { span: 15 },//右侧包裹的宽度
          };
        return(
            <Form  {...formItemLayout}
            >
                <Item label='角色名称'
                >
                    { getFieldDecorator('roleName', { 
                         rules: [{required: true, message: '角色名称必须输入'}]
                        })(
                        <Input placeholder='请输入角色名称'/> 
                        ) 
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm)