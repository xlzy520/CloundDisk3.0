import { getCategory } from '@/api/file'

const file = {
  state: {
    parentId: '-1',
    selectedData: [],
    uploadVisible: false,
    deleteVisible: false,
    detailVisible: false,
    versionVisible: false,
    fileList: [],
    showBtn: [],
    folderNav: [
      {
        fileId: -1,
        fileName: '公司文件'
      },
      { fileId: 2, fileName: '示例-按部门' },
      { fileId: 5, fileName: '销售部' },
      { fileId: 26, fileName: '啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊' }
    ]
  },
  mutations: {
    TOGGLE_UPLOADVISIBLE: state => {
      state.uploadVisible = !state.uploadVisible
    },
    TOGGLE_DELETEVISIBLE: state => {
      state.deleteVisible = !state.deleteVisible
    },
    TOGGLE_DETAILVISIBLE: state => {
      state.detailVisible = !state.detailVisible
    },
    GET_CATEGORY: (state, data) => {
      state.fileList = data
    },
    SET_PARENTID: (state, data) => {
      state.parentId = data
    },
    SET_FOLDERNAV: (state, data) => {
      state.folderNav.push(data)
    },
    GET_SELECTEDDATA: (state, data) => {
      state.selectedData = data
    }
  },
  actions: {
    ToggleUploadVisible: ({ commit }) => {
      commit('TOGGLE_UPLOADVISIBLE')
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
    async GetCategory({ commit }, fcategoryid) {
      const Category = await getCategory(fcategoryid)
      commit('GET_CATEGORY', Category.data.tableList)
    },
    async Refresh({ commit }) {
      const Category = await getCategory(this.state.parentId)
      commit('GET_CATEGORY', Category.data)
    },
    GetSelectedData({ commit }, data) {
      commit('GET_SELECTEDDATA', data)
    }
  }
}
export default file
