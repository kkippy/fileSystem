//对axios进行2次封装
import axios from 'axios'
import { ElMessage } from 'element-plus'
import {useUserStore} from '@/stores/user';
const request = axios.create({
    baseURL:import.meta.env.VITE_APP_BASE_API, //基础路径上会携带/api
    timeout:50000
})

//请求拦截器
request.interceptors.request.use(config =>{
    //config对象，headers属性请求头
    //获取用户仓库中的token信息
    const userStore = useUserStore()
    if (userStore.token) {
        config.headers.token = userStore.token
    }
    return config
},error => {
    return Promise.reject(new Error(`请求失败:${error}`))
    }
)

//响应拦截器
request.interceptors.response.use(res=>{
    return res.data
},error=>{
    //失败的回调
   let message = ''
    const status = error.response && error.response.status
    switch (status) {
        case 401:
            message = 'token过期'
            break
        case 404:
            message = '请求地址错误'
            break
        case 503:
            message = '服务器请求失败'
            break
        case 403:
            break

        default:
            message = '未知错误'
    }

    // ElMessage({
    //     type: 'error',
    //     message: message,
    // })
    // if(message === '未能读取到有效 token')

    return Promise.reject(new Error(`响应失败:${message}`))

})

export default request