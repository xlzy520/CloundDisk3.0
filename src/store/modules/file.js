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
      }
    ]
  },
  mutations: {
    TOGGLE_UPLOADVISIBLE: state => {
      state.uploadVisible = !state.uploadVisible
    },
    GET_CATEGORY: (state, data) => {
      state.fileList = data
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
