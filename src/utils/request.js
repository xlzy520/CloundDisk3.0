import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
import router from '../router';

// 创建axios实例
const service = axios.create({
  timeout: 20000 // 请求超时时间
});

// request拦截器
// service.interceptors.request.use(config => {
//   return config;
// }, error => {
//   console.log(error); // for debug
//   Promise.reject(error);
// });

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (!res.success) {
      if (res.msg === '120') {
        location.search.indexOf('from') !== -1 ? location.href = res.data.url : router.push('/login');
        // 判断来源，如果来自统一登录平台，则根据120跳转，否则跳转到系统本身的登录界面
      } else if (res.code === '70106002') {
        MessageBox.confirm('Token 过期了，您可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          router.push('/login');
        });
      } else {
        Message({
          message: res.msg,
          type: 'error',
          duration: 1500
        });
      }
      return Promise.reject(res);
    } else {
      return res;
    }
  },
  error => {
    error.message = error.message === 'timeout of 10000ms exceeded' ? '连接服务器超时！' : error.message;
    Message({
      message: error.message,
      type: 'error',
      duration: 1500
    });
    return Promise.reject(error);
  }
);

export default service;
