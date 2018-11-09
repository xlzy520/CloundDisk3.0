import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import router from '../router'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // if (store.getters.token) {
  //   config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  // }
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
    if (!res.success) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 1500
      })
      if (res.code === 100602) {
        if (router.history.current.path !== '/login') {
          MessageBox.confirm('Token 过期了，您可以取消继续留在该页面，或者重新登录', '确定登出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('FedLogOut').then(() => {
              location.reload()// 为了重新实例化vue-router对象 避免bug
            })
          })
        }
      }
      return Promise.reject(res)
    } else {
      return response.data
    }
  },
  error => {
    console.log(error.response)// for debug
    error.message = error.message === 'timeout of 5000ms exceeded' ? '连接服务器超时！' : error.message
    Message({
      message: error.message || error.msg,
      type: 'error',
      duration: 1500
    })
    return Promise.reject(error)
  }
)

export default service
