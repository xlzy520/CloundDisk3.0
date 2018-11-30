import fileService from '@/api/service/file';
import { Message } from 'element-ui';
const file = {
  state: {
    selectedData: [],
    actionArray: [],
  },
  mutations: {
    SET_SELECTED_DATA: (state, data) => {
      state.selectedData = data;
    },
    SET_ACTION_ARRAY: (state, data) => {
      state.actionArray = data;
    }
  },
  actions: {
    SetSelectedData({ commit }, data) {
      commit('SET_SELECTED_DATA', data);
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
  }
};
export default file;
