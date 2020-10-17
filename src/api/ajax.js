/*
发送异步ajax函数模块
封装axios库
函数返回值是promise对象
1. 优化： 统一处理请求异常： 在外层包一个自己创建的promise对象；请求出错时，不去reject（error），而是显示错误提示
2.优化：异步得到不是response，而是response。data；请求成功时，resolve(response.data)
*/
import axios from 'axios'
import { message } from 'antd';

export default function ajax(url, data={}, type='GET'){
    return new Promise((resolve, reject)=>{
        //1.执行异步ajax请求
        let promise
        if(type === 'GET'){//GET请求
            promise =  axios.get(url, {
                params: data//请求参数
            })
        } else{//POST请求
            promise =  axios.post(url, data)
        }
        //2. 如果成功了，调用resolve（value）
        promise.then(response=>{
            resolve(response.data)
        }).catch(error=>{//3. 如果失败了，不调用reject（reason），而是提示异常信息
            message.error('请求出错了：' + error.message)
        })
        

        
    })
    
}