import { getCategory, getDocInfo, getSearchResult } from '@/api/file'
import { Message } from 'element-ui'
import { Loading } from 'element-ui'
const file = {
  state: {
    parentId: '0',
    selectedData: [],
    upload: {
      visible: false,
      type: ''
    },
    deleteVisible: false,
    detailVisible: false,
    versionVisible: false,
    menuVisible: false,
    loadVisible: true,
    fileList: [],
    folderNav: [],
    preview: {
      visible: false,
      type: 'preview' // 新建markdown时需要首先展示编辑界面
    },
    docValue: '',
    searchList: null,
    hasSearch: false,
    coordinate: []
  },
  mutations: {
    TOGGLE_UPLOADVISIBLE: (state, data) => {
      state.upload.visible = !state.upload.visible
      state.upload.type = data
    },
    TOGGLE_DELETEVISIBLE: state => {
      state.deleteVisible = !state.deleteVisible
    },
    TOGGLE_DETAILVISIBLE: state => {
      state.detailVisible = !state.detailVisible
    },
    TOGGLE_VERSIONVISIBLE: state => {
      state.versionVisible = !state.versionVisible
      state.loadVisible = false
    },
    TOGGLE_PREVIEWVISIBLE: (state, data) => {
      state.preview.type = data
      state.preview.visible = !state.preview.visible
    },
    RIGHT_TOGGLE_MENUVISIBLE: (state, data) => {
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
    SET_FOLDERNAV: (state, data) => {
      state.folderNav = data
    },
    SET_SELECTEDDATA: (state, data) => {
      state.selectedData = data
    },
    GET_DOC_INFO: (state, data) => {
      state.docValue = data
    },
    SETSEARCHLIST: (state, data) => {
      state.searchList = data
    },
    TOGGLE_SEARCH: (state, data) => {
      state.hasSearch = data
    }
  },
  actions: {
    ToggleUploadVisible: ({ commit }, type) => {
      commit('TOGGLE_UPLOADVISIBLE', type)
    },
    ToggleDeleteVisible: ({ commit }) => {
      commit('TOGGLE_DELETEVISIBLE')
    },
    ToggleDetailVisible: ({ commit }) => {
      commit('TOGGLE_DETAILVISIBLE')
    },
    ToggleVersionVisible: ({ commit }) => {
      commit('TOGGLE_VERSIONVISIBLE')
    },
    TogglePreviewVisible: ({ commit }, data) => {
      commit('TOGGLE_PREVIEWVISIBLE', data)
    },
    RightTogglemenuVisible: ({ commit }, data) => {
      commit('RIGHT_TOGGLE_MENUVISIBLE', data)
    },
    async GetCategory({ commit }, fcategoryid) {
      return new Promise((resolve, reject) => {
        const loadingInstance = Loading.service({ fullscreen: true })
        getCategory(fcategoryid).then(response => {
          const Category = response
          loadingInstance.close()
          commit('GET_CATEGORY', Category.data.tableList)
          commit('SET_FOLDERNAV', Category.data.navList)
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
        commit('SET_FOLDERNAV', Category.data.navList)
      }
      return Category
    },
    SetSelectedData({ commit }, data) {
      commit('SET_SELECTEDDATA', data)
    },
    async GetDocInfo({ commit }, fcategoryid) {
      const docInfo = await getDocInfo(fcategoryid)
      if (docInfo.success) {
        commit('GET_DOC_INFO', docInfo.data)
        commit('TOGGLE_PREVIEWVISIBLE', 'preview')
      }
    },
    async SetSearchList({ commit }, queryString) {
      const searchList = await getSearchResult(queryString)
      if (searchList.success) {
        Message({
          type: 'success',
          message: '查询成功',
          duration: 1000
        })
        commit('SETSEARCHLIST', searchList.data)
        commit('TOGGLE_SEARCH', true)
      }
    },
    ToggleSearch({ commit }, data) {
      commit('TOGGLE_SEARCH', data)
    },
    NewMarkdownFile({ commit }) {
      commit('GET_DOC_INFO', {})
      commit('TOGGLE_PREVIEWVISIBLE', 'create')
    }
  }
}
export default file
