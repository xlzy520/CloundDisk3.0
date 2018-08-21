import { getCategory } from '@/api/file'
const file = {
  state: {
    parentId: '-1',
    selectedData: [],
    uploadVisible: false,
    fileList: [],
    folderNav: [
      {
        fileId: 0,
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
    GET_CATEGORY: (state, data) => {
      state.fileList = data
    },
    SET_PARENTID: (state, data) => {
      state.parentId = data
    },
    SET_FOLDERNAV: (state, data) => {
      state.folderNav.push(data)
    }
  },
  actions: {
    ToggleUploadVisible: ({ commit }) => {
      commit('TOGGLE_UPLOADVISIBLE')
    },
    async GetCategory({ commit }, fcategoryid) {
      const Category = await getCategory(fcategoryid)
      commit('GET_CATEGORY', Category.data)
    }
  }
}

export default file
