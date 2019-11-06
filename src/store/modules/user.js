import loginService from '@/api/service/login';
import md5 from 'md5';
import router from "../../router";

const user = {
  state: {
    userData: {},
  },

  mutations: {
    SET_USER_DATA: (state, userData) => {
      state.userData = userData;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      const password = md5(userInfo.password);
      return new Promise((resolve, reject) => {
        loginService.login(username, password).then(response => {
          const data = response.data;
          commit('SET_USER_DATA', data);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 获取用户信息
    GetInfo({ commit }, redirect) {
      return new Promise((resolve, reject) => {
        loginService.getInfo().then(response => {
          const data = response.data;
          commit('SET_USER_DATA', data);
          resolve(response);
        }).catch(error => {
          if (error.msg === '120') {
            // 判断来源，如果来自统一登录平台，则根据120跳转，否则跳转到系统本身的登录界面
            // 来自统一登录门户
            if (sessionStorage.getItem('from') === 'sso') {
              location.href = error.data.url;
            } else {
              // 直接进入云盘首页
              router.push('/login?redirect=' + redirect);
            }
          } else {
            reject(error);
          }
        });
      });
    },

    // 登出
    LogOut({commit}) {
      return new Promise((resolve, reject) => {
        loginService.logout().then(() => {
          resolve();
        }).catch(error => {
          reject(error);
        }).finally(()=>{
          commit('SET_USER_DATA', {});
        });
      });
    },
  }
};

export default user;
