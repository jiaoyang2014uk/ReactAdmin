import React, {Component} from 'react'
import { Card, Button, Table, Modal, message } from 'antd';
import {formateDate} from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import {PAGE_SIZE} from '../../utils/constants'
import {reqUsers, reqDeleteUser, reqAddOrUpdateUser} from '../../api'
import UserForm from './user-form'
/**
 * 用户路由
 */
export default class User extends Component{
    state={
        users:[],//所有的用户列表
        roles:[],//所有的角色列表
        isShow: false,//是否显示确认框
    }

    initColums = () =>{
        this.columns = [
            {
              title: '用户名',
              dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id)=>this.roleNames[role_id]
            },
            {
              title: '操作',
              render:(user)=>(
                    <span>
                      <LinkButton onClick={()=>this.showUpdate(user)}>修改</LinkButton>
                      <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>
                  </span>
              )
            }
          ];
    }
    //  根据roles的数组生成包含所有角色名的对象（属性名用角色id值）
    initRoleNames = (roles) => {
        const roleNames =  roles.reduce((pre, role)=>{
            pre[role._id]= role.name
            return pre
        },{})
        //保存
        this.roleNames = roleNames
    }
    showAdd = () => {
        this.user = null//去除前面保存的user
        this.setState({isShow: true})
    }
    //显示修改页面
    showUpdate = (user) => {
        this.user = user
        this.setState({isShow:true})
    }
    //删除指定用户
    deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗？`,
            onOk : async () =>{
                const result = await reqDeleteUser(user._id)
                if(result.status=== 0){
                    message.success('删除用户成功')
                    this.getUsers()
                } else {
                    message.success('删除用户失败')
                }
            }
        })
    }
    //  添加或者更新用户
    addOrUpdateUser = async () => {
        this.setState({isShow: false})
        //收集输入数据
        const user = this.form.getFieldsValue()
        this.form.resetFields()
        //如果是更新，需要给user提供id属性
        if(this.user){
            user._id = this.user._id
        }
        //提交添加的请求
        const result = await reqAddOrUpdateUser(user)
        //更新列表显示
        if(result.status=== 0){
            message.success(`${this.user ? '更新': '添加'}用户成功`)
            this.getUsers()
        } else {
            message.error(`${this.user ? '更新': '添加'}用户失败`)
        }
        

    }
    getUsers=async ()=>{
        const result = await reqUsers()
        if(result.status=== 0){
            const {users, roles} = result.data
            const mock = [
                {username: '张三', create_time: 1554639521749, email: '111@qq.com', phone: '13711111111', _id: 1, role_id: 1},
                {username: '李四', create_time: 1554639521749, email: '222@qq.com', phone: '13722222222', _id: 2, role_id: 2},
                {username: '王五', create_time: 1554639521749, email: '333@qq.com', phone: '13733333333', _id: 3, role_id: 3},
            ]
            const mock1 = [
                {name: '测试', create_time: 1554639521749, auth_time: 1554639521749, auth_name: 'admin', _id: 1, role_id: 1},
                {name: '经理', create_time: 1554639521749, auth_time: 1554639521749, auth_name: 'admin', _id: 2, role_id: 2},
                {name: '用户', create_time: 1554639521749, auth_time: 1554639521749, auth_name: 'admin', _id: 3, role_id: 3},
            ]
            // this.setState({users, roles})
            // this.initRoleNames(roles)
            this.initRoleNames(mock1)
            this.setState({users:mock, roles:mock1})
        }
    }

    componentWillMount(){
        this.initColums()
    }
    componentDidMount(){
        this.getUsers()
    }
    render(){
        //读取状态数据
        const {users, isShow, roles} = this.state
        const user = this.user
         //card的左侧
         const title= (
            <span>
                <Button type='primary' onClick={this.showAdd}>创建用户</Button>
            </span>
        )
        return(
            <Card title={title}>
                <Table 
                    dataSource={users} 
                    columns={this.columns} 
                    bordered
                    rowKey='_id'
                    pagination={{defaultPageSize: PAGE_SIZE}}
                />;
                 <Modal
                    title={user && user._id? '修改用户':'添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={()=>{
                        this.form.resetFields()
                        this.setState({isShow: false})
                    }}
                    >
                        <UserForm setForm = {form=>this.form=form} roles={roles} user={user}/>
                </Modal>
            </Card>
        )
    }
}