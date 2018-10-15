import { getCategory, getDocInfo, getSearchResult, getFullTextSearchResult } from '@/api/file'
import { Message } from 'element-ui'
import { Loading } from 'element-ui'
const file = {
  state: {
    parentId: '0',
    selectedData: [],
    imgEditor: {
      visible: false,
      id: ''
    },
    menuVisible: false,
    loadVisible: true,
    fileList: [],
    folderNav: [],
    preview: {
      visible: false,
      type: 'preview' // 新建markdown时需要首先展示编辑界面
    },
    docValue: {},
    searchList: null,
    hasSearch: false,
    coordinate: []
  },
  mutations: {
    TOGGLE_IMG_EDITOR: (state, data) => {
      state.imgEditor.visible = !state.imgEditor.visible
      state.imgEditor.id = data
    },
    TOGGLE_PREVIEW_VISIBLE: (state, data) => {
      state.preview.type = data
      state.preview.visible = !state.preview.visible
    },
    RIGHT_TOGGLE_MENU_VISIBLE: (state, data) => {
      state.coordinate = data
      state.menuVisible = state.coordinate[2]
    },
    GET_CATEGORY: (state, data) => {
      state.fileList = data
      state.loadVisible = false
    },
    SET_PARENT_ID: (state, data) => {
      state.parentId = data
    },
    SET_FOLDER_NAV: (state, data) => {
      state.folderNav = data
    },
    SET_SELECTED_DATA: (state, data) => {
      state.selectedData = data
    },
    GET_DOC_INFO: (state, data) => {
      state.docValue = data
    },
    SET_SEARCH_LIST: (state, data) => {
      state.searchList = data
    },
    TOGGLE_SEARCH: (state, data) => {
      state.hasSearch = data
    }
  },
  actions: {
    ToggleImgEditor: ({ commit }, data) => {
      commit('TOGGLE_IMG_EDITOR', data)
    },
    TogglePreviewVisible: ({ commit }, data) => {
      commit('TOGGLE_PREVIEW_VISIBLE', data)
    },
    RightTogglemenuVisible: ({ commit }, data) => {
      commit('RIGHT_TOGGLE_MENU_VISIBLE', data)
    },
    async GetCategory({ commit }, fcategoryid) {
      return new Promise((resolve, reject) => {
        const loadingInstance = Loading.service({ fullscreen: true })
        getCategory(fcategoryid).then(response => {
          const Category = response
          loadingInstance.close()
          commit('GET_CATEGORY', Category.data.tableList)
          commit('SET_FOLDER_NAV', Category.data.navList)
          resolve(response)
        }).catch(error => {
          loadingInstance.close()
          reject(error)
        })
      })
    },
    SetParentId: ({ commit }, id) => {
      commit('SET_PARENT_ID', id)
    },
    async Refresh({ commit }) {
      const Category = await getCategory(this.getters.parentId)
      if (Category.success) {
        commit('GET_CATEGORY', Category.data.tableList)
        commit('SET_FOLDER_NAV', Category.data.navList)
      }
      return Category
    },
    SetSelectedData({ commit }, data) {
      commit('SET_SELECTED_DATA', data)
    },
    async GetDocInfo({ commit }, data) {
      const { fcategoryid, fversionsign } = data
      const docInfo = await getDocInfo(fcategoryid)
      if (docInfo.success) {
        docInfo.data.fversionsign = fversionsign
        commit('GET_DOC_INFO', docInfo.data)
        commit('TOGGLE_PREVIEW_VISIBLE', 'preview')
      }
    },
    async SetSearchList({ commit }, data) {
      const { fullTextBoolean, queryString } = data
      let searchList
      if (fullTextBoolean) {
        searchList = await getFullTextSearchResult(queryString)
      } else {
        searchList = await getSearchResult(queryString)
      }
      if (searchList && searchList.success) {
        if (searchList.data.bookList.length === 0) {
          Message({
            type: 'info',
            message: '搜索成功,搜索结果为空',
            duration: 1000
          })
        } else {
          Message({
            type: 'success',
            message: '搜索成功',
            duration: 1000
          })
          commit('SET_SEARCH_LIST', searchList.data)
          commit('TOGGLE_SEARCH', true)
        }
      }
    },
    ToggleSearch({ commit }, data) {
      commit('TOGGLE_SEARCH', data)
    },
    NewMarkdownFile({ commit }) {
      commit('GET_DOC_INFO', {})
      commit('TOGGLE_PREVIEW_VISIBLE', 'create')
    }
  }
}
export default file
