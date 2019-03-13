import axios from 'axios';
import { Message } from 'element-ui';
import store from '../store';
import router from '../router';
import { removeToken } from '@/utils/auth';

// 创建axios实例
const service = axios.create({
  timeout: 20000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
  return config;
}, error => {
  console.log(error); // for debug
  Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (!res.success) {
      if (res.code === "100602" || res.msg === 'token已过期') { //exchangeToken接口没有code，只有msg
        if (router.history.current.path !== '/login') {
          removeToken();
          store.dispatch('FedLogOut').then(() => {
            router.push('/login');
            //location.reload();// 为了重新实例化vue-router对象 避免bug
          });
        }
      } else if (res.msg === '120') {
        // 报120时，统一登录平台标志
      } else {
        Message({
          message: res.msg,
          type: 'error',
          duration: 1500
        });
      }
      return Promise.reject(res);
    } else {
      return response.data;
    }
  },
  error => {
    console.log(error, error.response);// for debug
    error.message = error.message === 'timeout of 5000ms exceeded' ? '连接服务器超时！' : error.message;
    //removeToken();
    Message({
      message: error.message || error.msg,
      type: 'error',
      duration: 1500
    });
    return Promise.reject(error);
  }
);

export default service;
