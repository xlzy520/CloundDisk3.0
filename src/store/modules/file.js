import { getCategory, getDocInfo, getSearchResult, getFullTextSearchResult } from '@/api/file'
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
    move: {
      visible: false,
      type: ''
    },
    deleteVisible: false,
    detailVisible: false,
    versionVisible: false,
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
    TOGGLE_UPLOAD_VISIBLE: (state, data) => {
      state.upload.visible = !state.upload.visible
      state.upload.type = data
    },
    TOGGLE_DELETE_VISIBLE: state => {
      state.deleteVisible = !state.deleteVisible
    },
    TOGGLE_IMG_EDITOR: (state, data) => {
      state.imgEditor.visible = !state.imgEditor.visible
      state.imgEditor.id = data
    },
    TOGGLE_DETAIL_VISIBLE: state => {
      state.detailVisible = !state.detailVisible
    },
    TOGGLE_VERSION_VISIBLE: state => {
      state.versionVisible = !state.versionVisible
      state.loadVisible = false
    },
    TOGGLE_PREVIEW_VISIBLE: (state, data) => {
      state.preview.type = data
      state.preview.visible = !state.preview.visible
    },
    TOGGLE_MOVE_VISIBLE: (state, data) => {
      state.move.visible = !state.move.visible
      state.move.type = data
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
    ToggleUploadVisible: ({ commit }, type) => {
      commit('TOGGLE_UPLOAD_VISIBLE', type)
    },
    ToggleDeleteVisible: ({ commit }) => {
      commit('TOGGLE_DELETE_VISIBLE')
    },
    ToggleDetailVisible: ({ commit }) => {
      commit('TOGGLE_DETAIL_VISIBLE')
    },
    ToggleImgEditor: ({ commit }, data) => {
      commit('TOGGLE_IMG_EDITOR', data)
    },
    ToggleVersionVisible: ({ commit }) => {
      commit('TOGGLE_VERSION_VISIBLE')
    },
    TogglePreviewVisible: ({ commit }, data) => {
      commit('TOGGLE_PREVIEW_VISIBLE', data)
    },
    ToggleMoveVisible: ({ commit }, type) => {
      commit('TOGGLE_MOVE_VISIBLE', type)
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
    async GetDocInfo({ commit }, { fcategoryid, fversionsign }) {
      const docInfo = await getDocInfo(fcategoryid)
      if (docInfo.success) {
        docInfo.data.fversionsign = fversionsign
        commit('GET_DOC_INFO', docInfo.data)
        commit('TOGGLE_PREVIEW_VISIBLE', 'preview')
      }
    },
    async SetSearchList({ commit }, query) {
      const { fullTextBoolean, queryString } = query
      let searchList
      if (fullTextBoolean) {
        searchList = await getFullTextSearchResult(queryString)
      } else {
        searchList = await getSearchResult(queryString)
      }
      if (searchList.success) {
        Message({
          type: 'success',
          message: '查询成功',
          duration: 1000
        })
        commit('SET_SEARCH_LIST', searchList.data)
        commit('TOGGLE_SEARCH', true)
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
