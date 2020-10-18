import React, {Component} from 'react'
import { Card, Button, Table, Modal, message } from 'antd';
import {connect} from 'react-redux'
import {PAGE_SIZE} from '../../utils/constants'
import {reqRoles, reqAddRole, reqUpdateRole} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
// import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {formateDate} from '../../utils/dateUtils'
import {logout} from '../../redux/actions'
/**
 * 角色管理路由
 */
class Role extends Component{
    state={
        roles:[],//所有角色的列表
        role:{},//选中的role
        isShowAdd: false,//是否显示添加界面
        isShowAuth: false,//是否显示设置权限界面
    }
    constructor(props){
        super(props)
        this.auth = React.createRef()
    }
    initColums=()=>{
        this.columns=[
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) =>formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            },
        ]
    }
    getRoles=async ()=>{
        const result = await reqRoles()
        if(result.status=== 0){
            const roles = result.data
            const mock = [
                {name: '测试', create_time: 1554639521749, auth_time: 1554639521749, auth_name: 'admin', _id: 1, menus: ['/home']},
                {name: '经理', create_time: 1554639521749, auth_time: 1554639521749, auth_name: 'admin', _id: 2, menus: ['/home', '/category', '/user']},
                {name: '用户', create_time: 1554639521749, auth_time: 1554639521749, auth_name: 'admin', _id: 3, menus: ['/home', '/role', '/charts/bar', '/charts/pie']},
            ]
            // this.setState({roles})
            this.setState({roles:mock})
        }
    }
    onRow = (role) => {
        return {
            onClick: event => {// 点击行
                this.setState({role})
            }, 
          };
    }
    //添加角色
    addRole = async () => {
        //进行表单验证，只有通过了，才向下处理
        this.form.validateFields(async(err, values)=>{
            if(!err){
                //隐藏确认框
                this.setState({isShowAdd: false})
                //收集输入数据
                const {roleName} = values
                this.form.resetFields()
                //请求添加
                const result = await reqAddRole(roleName)
                //根据结果提示 更新列表显示
                if(result.status=== 0){
                   message.success('添加角色成功')
                   //新产生的角色
                   const role = result.data
                   //更新roles的状态
                //    const roles =[...this.state.roles]
                //    roles.push(role)
                //    this.setState({roles})
                this.setState(state=>({
                    roles: [...state.roles, role]
                }))
                } else {
                   message.error('添加角色失败')
                }
            }
        })
    }
    //更新角色
    updateRole = async () =>{
        //隐藏确认框
        this.setState({isShowAuth: false})
        const role = this.state.role
        //得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        // role.auth_name = memoryUtils.user.username
        role.auth_name = this.props.user.username
         //请求更新
         const result = await reqUpdateRole(role)
         if(result.status=== 0){
            
            // this.getRoles()
            //如果用户更新的是自己角色的权限，强制退出
            // if(role._id === memoryUtils.user.role_id){
            if(role._id === this.props.user.role_id){
                /*
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                */
               this.props.logout()
                message.success('当前角色权限修改了，重新登录')
            }else{
                message.success('设置角色权限成功')
                this.setState({
                    roles: [...this.state.roles]
                })
            }
         
         } else {
            message.error('添加角色失败')
         }
    }
    componentWillMount(){
        this.initColums()
    }
    componentDidMount(){
        this.getRoles()
    }
    render(){
        const {roles, role, isShowAdd, isShowAuth} = this.state
         //card的左侧
         const title= (
            <span>
                <Button type='primary' onClick={()=>this.setState({isShowAdd: true})}>创建角色</Button>&nbsp;&nbsp;
                <Button type='primary' onClick={()=>this.setState({isShowAuth: true})} disabled={!role._id}>设置角色权限</Button>
            </span>
        )
        return(
            <Card title={title}>
                <Table 
                    bordered
                    rowKey='_id'
                    dataSource={roles} 
                    columns={this.columns} 
                    pagination={{defaultPageSize: PAGE_SIZE,}}
                    rowSelection={{
                        type: 'radio', 
                        selectedRowKeys: [role._id],
                        onSelect: (role)=>{
                            this.setState({role})
                        }
                    }}
                    onRow={this.onRow}
                />;
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={()=>{
                        this.setState({isShowAdd: false})
                        this.form.resetFields()
                    }}
                    >
                    <AddForm 
                    setForm={form => this.form = form}
                    />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={()=>{
                        this.setState({isShowAuth: false})
                    }}
                    >
                    <AuthForm role={role} ref={this.auth}/>
                </Modal>
            </Card>
        )
    }
}
export default connect(
    state => ({user: state.user}),
    {logout}
)(Role)