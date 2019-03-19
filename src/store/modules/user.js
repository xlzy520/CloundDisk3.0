import loginService from '@/api/service/login';
import md5 from 'md5';

const user = {
  state: {
    userData: {},
    authData: [],
    groupNum: "",
    employee: "",
    employeeAuth: [],
    authList: []
  },

  mutations: {
    SET_USER_DATA: (state, userData) => {
      state.userData = userData;
    },
    SET_AUTH_DATA: (state, authData) => {
      state.authData = authData;
    },
    SET_GROUP_NUM: (state, data) => {
      state.groupNum = data;
    },
    SET_EMPLOYEE: (state, data) => {
      state.employee = data;
    },
    SET_EMPLOYEE_AUTH: (state, data) => {
      state.employeeAuth = data;
    },
    SET_AUTH: (state, data) => {
      state.authList = data;
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
    // 存储选中的文件夹权限
    SaveData({ commit }, data) {
      return new Promise(resolve => {
        commit('SET_AUTH_DATA', data);
        resolve();
      });
    },
    // 选中的组织列表编号
    ChooseGroup({ commit }, data) {
      commit('SET_GROUP_NUM', data);
    },
    // 选中的员工列表权限
    ChooseEmployee({ commit }, data) {
      commit('SET_EMPLOYEE', data);
    },
    // 选中的员工列表
    SelectEmployee({ commit }, data) {
      commit('SET_EMPLOYEE_AUTH', data);
    },
    // 选中的权限
    SelectAuth({ commit }, data) {
      commit('SET_AUTH', data);
    }
  }
};

export default user;
