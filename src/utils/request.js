import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
import router from '../router';

// 创建axios实例
const service = axios.create({
  baseURL: '/djcpsdocument',
  timeout: 10000 // 请求超时时间
});
let flag = 0;//防止登录失效出现三次弹窗
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
      if (res.code === '70106002') {
        flag++;
        if (flag < 2) {
          const redirect = router.history.current.fullPath;
          MessageBox.confirm('Token 过期了，您可以取消继续留在该页面，或者重新登录', '确定登出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            flag = 0;
            router.push('/login?redirect=' + redirect);
          });
        }
      } else {
        if (res.msg !== '120') {
          Message({
            message: res.msg,
            type: 'error',
            duration: 1500
          });
        }
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
