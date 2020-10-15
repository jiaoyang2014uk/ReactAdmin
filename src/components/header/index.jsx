import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import LinkButton from '../link-button'
import {reqWeather} from '../../api'
import menuList from '../../config/menuConfig'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import './index.less'
const { confirm } = Modal;
/**
 * 首页路由
 */
class Header extends Component{
    state = {
        currentTime: formateDate(Date.now()),
        dayPictureUrl: '',//天气图片url
        weather: ''//天气文本
    }

    getTime = () => {
        //每隔1s获取当前时间，并更新状态数据currenttime
        this.intervalId = setInterval(()=>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }

    getWeather = async () =>{
        //调用接口请求异步获取数据
        const {dayPictureUrl, weather} = await reqWeather('北京')
        //更新状态
        this.setState({dayPictureUrl, weather})
    }

    getTitle = () =>{
        //得到当前请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item=>{
            if(item.key === path){//如果当前item对象的key与path一样，item的titile就是我要显示的title
                title = item.title
            } else if(item.children){
                //在所有子item中查找匹配的
                const cItem = item.children.find(cItem=>cItem.key === path)
                //如果有值说明匹配
                if(cItem){
                    //取出titlle
                    title = cItem.title
                }
            }
        })
        return title
    }
//退出登录
    logout = () => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: '确定退出吗？',
            onOk : () => {
              //删除保存的user数据
              storageUtils.removeUser()
              memoryUtils.user={}
              //跳转到login
              this.props.history.replace('/login')
            },
          })
    }

    //第一次render后执行一次；一般在此异步操作：ajax、定时器
    componentDidMount(){
        //获取当前时间
        this.getTime()
        //获取当前天气显示
        this.getWeather()

    }
    //当前组件卸载前调用
    componentWillUnmount(){
        //清除定时器
        clearInterval(this.intervalId)

    }
    render(){
        const {currentTime, dayPictureUrl, weather} = this.state
        const username = memoryUtils.user.username
        const title = this.getTitle()
        return(
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)