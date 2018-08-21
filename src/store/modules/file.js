import { getCategory } from '@/api/file'
const file = {
  state: {
    uploadVisible: false,
    list: []
  },
  mutations: {
    TOGGLE_UPLOADVISIBLE: state => {
      state.uploadVisible = !state.uploadVisible
    },
    GET_CATEGORY: (state, data) => {
      state.list = data
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
