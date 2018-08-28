import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.success !== true) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 2 * 1000
      })
      console.log(1)
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log(error.response)// for debug
    error.message = error.message === 'timeout of 5000ms exceeded' ? '连接超时！' : error.message
    Message({
      message: error.message || error.msg,
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
