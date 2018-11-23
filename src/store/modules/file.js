import fileService from '@/api/service/file.js';
import { Message, Loading } from 'element-ui';
const file = {
  state: {
    parentId: '0',
    selectedData: [],
    menuVisible: false,
    loadVisible: true,
    fileList: [],
    folderNav: [],
    searchList: null,
    hasSearch: false,
    coordinate: []
  },
  mutations: {
    TOGGLE_IMG_EDITOR: (state, data) => {
      state.imgEditor.visible = !state.imgEditor.visible;
      state.imgEditor.id = data;
    },
    TOGGLE_PREVIEW_VISIBLE: (state, data) => {
      state.preview.type = data;
      state.preview.visible = !state.preview.visible;
    },
    RIGHT_TOGGLE_MENU_VISIBLE: (state, data) => {
      state.coordinate = data;
      state.menuVisible = state.coordinate[2];
    },
    GET_CATEGORY: (state, data) => {
      state.fileList = data;
      state.loadVisible = false;
    },
    SET_PARENT_ID: (state, data) => {
      state.parentId = data;
    },
    SET_FOLDER_NAV: (state, data) => {
      state.folderNav = data;
    },
    SET_SELECTED_DATA: (state, data) => {
      state.selectedData = data;
    },
    SET_SEARCH_LIST: (state, data) => {
      state.searchList = data;
    },
    TOGGLE_SEARCH: (state, data) => {
      state.hasSearch = data;
    }
  },
  actions: {
    ToggleImgEditor: ({ commit }, data) => {
      commit('TOGGLE_IMG_EDITOR', data);
    },
    TogglePreviewVisible: ({ commit }, data) => {
      commit('TOGGLE_PREVIEW_VISIBLE', data);
    },
    RightTogglemenuVisible: ({ commit }, data) => {
      commit('RIGHT_TOGGLE_MENU_VISIBLE', data);
    },
    GetCategory({ commit }, fcategoryid) {
      return new Promise((resolve, reject) => {
        const loadingInstance = Loading.service({ fullscreen: true });
        fileService.getCategory(fcategoryid).then(res => {
          loadingInstance.close();
          commit('GET_CATEGORY', res.data.tableList);
          commit('SET_FOLDER_NAV', res.data.navList);
          resolve(res);
        }).catch(err => {
          loadingInstance.close();
          reject(err);
        });
      });
    },
    SetParentId: ({ commit }, id) => {
      commit('SET_PARENT_ID', id);
    },
    async Refresh({ commit }) {
      const Category = await fileService.getCategory(this.getters.parentId);
      if (Category.success) {
        commit('GET_CATEGORY', Category.data.tableList);
        commit('SET_FOLDER_NAV', Category.data.navList);
      }
      return Category;
    },
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
    ToggleSearch({ commit }, data) {
      commit('TOGGLE_SEARCH', data);
    },
  }
};
export default file;
