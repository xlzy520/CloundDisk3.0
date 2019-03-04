import loginService from '@/api/service/login';
import { getToken, setToken, removeToken } from '@/utils/auth';
import md5 from 'md5';

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    utype: '', // 用户操作权限 0 普通用户，无分配权限和钉钉操作权限， 1 普通管理员和超级管理员， 拥有最高权限
    fcategoryid: '',
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_UTYPE: (state, utype) => {
      state.utype = utype;
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      const password = md5(userInfo.password);
      return new Promise((resolve, reject) => {
        loginService.login(username, password).then(response => {
          const data = response.data;
          setToken(data.token);
          commit('SET_TOKEN', data.token);
          commit('SET_NAME', data.userName);
          commit('SET_AVATAR', data.userIco);
          commit('SET_UTYPE', data.utype);
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
          setToken(data.token);
          commit('SET_TOKEN', data.token);
          commit('SET_NAME', data.userName);
          commit('SET_AVATAR', data.userIco);
          commit('SET_UTYPE', data.utype);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        loginService.logout().then(() => {
          commit('SET_TOKEN', '');
          removeToken();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        removeToken();
        resolve();
      });
    }
  }
};

export default user;
