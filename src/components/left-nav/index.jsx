import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import { Menu, Icon } from 'antd';
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
import './index.less'
const { SubMenu } = Menu;

/**
 * 左侧导航组件
 */
class LeftNav extends Component{
    //判断当前用户是否对item有权限
    hasAuth = (item) => {
        const {key, isPublic} = item
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username

        //如果用户是admin
        //如果item是isPublic公开的
        //如果用户有此item权限；key是否在menus中
        if(username === 'admin' || isPublic || menus.indexOf(key) !== -1){
            return true
        } else if(item.children){//如果用户有item子项的权限
            return !!item.children.find(child=>menus.indexOf(child.key)!== -1)
        }

    }
    //根据menu数据数组生产对应的标签数组 map+递归
    getMenuNodes_map = (menuList) => {
        return menuList.map(item=>{
            if(!item.children){
                return (
                    <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.key}>{item.title}</Link>
                        </Menu.Item>
                )
            } else {
                return (
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {this.getMenuNodes_map(item.children)}
                    </SubMenu>
                )
            }
        })
    }
//根据menu数据数组生产对应的标签数组 reduce+递归
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.reduce((pre, item)=>{
            //如果当前用户有item权限，才显示对应菜单项
            if(this.hasAuth(item)){
                //向pre中添加Menu.Item
                if(!item.children){
                    pre.push((
                        <Menu.Item key={item.key} >
                                <Link to={item.key}>
                                    <Icon type={item.icon}/>
                                    <span>{item.title}</span>
                                </Link>
                            </Menu.Item>
                    ))
                } else {
                    //查找一个与当前请求路径匹配的子item
                const cItem =  item.children.find(cItem=> path.indexOf(cItem.key)===0)
                //如果存在，说明当前item的子列表需要打开
                if(cItem){
                    this.openKey = item.key
                }
                    //向pre中添加SubMenu
                    pre.push((
                        <SubMenu key={item.key} title={ <span> <Icon type={item.icon}/> <span>{item.title}</span> </span> }>
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))

                }
            }
            return pre
        },[])
    }
//第一次render之前执行一次；为第一次render渲染做准备 必须是同步的
    componentWillMount(){
        this.menuNode = this.getMenuNodes(menuList)
    }
    render(){
        //得到当前请求路由路径（非路由组件变成路由组件withrouter）
        let path = this.props.location.pathname
        if(path.indexOf('/product')=== 0){//当前请求的是商品或者其子路由
            path = '/product'
        }
        //得到需要打开菜单项的key
        const openKey = this.openKey
        return(
            <div>
                <div  className='left-nav'>
                    <Link to='/' className='left-nav-header'>
                        <img src={logo} alt= 'logo'/>
                        <h1>硅谷后台</h1>
                    </Link>

                    <Menu
                        mode="inline"
                        theme="dark"
                        selectedKeys={[path]}
                        defaultOpenKeys={[openKey]}
                    >
                        {
                            this.menuNode
                        }

                </Menu>
                </div>
            </div>
            
        )
    }
}
/**
 * widhtouter高阶组件
 * 包装非路由组件，返回新组件
 * 新组件向非路由组件传递三个属性：history location match
 */
export default withRouter(LeftNav)