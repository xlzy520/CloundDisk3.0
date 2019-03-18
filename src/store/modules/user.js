import loginService from '@/api/service/login';
import md5 from 'md5';

const user = {
  state: {
    userData: {},
    authData: [],
    GroupNum: "",
    EMPLYOEE: "",
    EMPLYOEEAUTH: [],
  },

  mutations: {
    SET_USER_DATA: (state, userData) => {
      state.userData = userData;
    },
    SET_AUTH_DATA: (state, authData) => {
      state.authData = authData;
    },
    SET_GROUP: (state, data) => {
      state.GroupNum = data;
    },
    SET_EMPLYOEE: (state, data) => {
      state.EMPLYOEE = data;
    },
    SET_EMPLYOEEAUTH: (state, data) => {
      state.EMPLYOEEAUTH = data;
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
    // 存储选中的文件夹权限
    SaveData({ commit }, data) {
      return new Promise(resolve => {
        commit('SET_AUTH_DATA', data);
        resolve();
      });
    },
    // 选中的组织列表编号
    ChooseGroup({ commit }, data) {
      commit('SET_GROUP', data);
    },
    // 选中的员工列表
    ChooseEmplyoee({ commit }, data) {
      commit('SET_EMPLYOEE', data);
    },
    // 选中的员工列表
    SelectEmplyoee({ commit }, data) {
      commit('SET_EMPLYOEEAUTH', data);
    },
  }
};

export default user;
