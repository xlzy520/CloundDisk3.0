import fileService from '@/api/service/file';
import authService from '@/api/service/auth';
import { Message } from 'element-ui';
import router from '@/router';

const file = {
  state: {
    selectedData: [],
    actionArray: [],
    authArr: [],
  },
  mutations: {
    SET_SELECTED_DATA: (state, data) => {
      state.selectedData = data;
    },
    SET_ACTION_ARRAY: (state, data) => {
      state.actionArray = data;
    },
    SET_AUTH_ARR: (state, data) => {
      state.authArr = data;
    }
  },
  actions: {
    SetSelectedData({ commit }, data) {
      commit('SET_SELECTED_DATA', data);
    },
    SetAuthArr({ commit }, data) {
      commit('SET_AUTH_ARR', data);
    },
    async SetSearchList({ commit }, data) {
      const { fullTextBoolean, queryString } = data;
      let searchList;
      if (fullTextBoolean) {
        searchList = await fileService.getFullTextSearchResult(queryString);
      } else {
        searchList = await fileService.getSearchResult(queryString);
      }
      if (searchList && searchList.success) {
        if (searchList.data.bookList.length === 0) {
          Message({
            type: 'info',
            message: '搜索成功,搜索结果为空',
            duration: 1000
          });
        } else {
          Message({
            type: 'success',
            message: '搜索成功',
            duration: 1000
          });
          commit('SET_SEARCH_LIST', searchList.data);
          commit('TOGGLE_SEARCH', true);
        }
      }
    },
    changeActionArray({ commit }, data) {
      commit('SET_ACTION_ARRAY', data);
    },
    QueryPermission({}, data) {
      return new Promise((resolve, reject) => {
        authService.getAuthListByCategory(data).then(response => {
          const isEdit = response.data.userList.length > 0 ? 1 : 0;
          router.push(`/index/auth?isEdit=${isEdit}`);
          //resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    }
  }
};
export default file;
