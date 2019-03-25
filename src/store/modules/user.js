import loginService from '@/api/service/login';
import md5 from 'md5';

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
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        loginService.getInfo(state.token).then(response => {
          const data = response.data;
          commit('SET_USER_DATA', data);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 登出
    LogOut() {
      return new Promise((resolve, reject) => {
        loginService.logout().then(() => {
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
  }
};

export default user;
