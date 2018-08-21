const file = {
  state: {
    uploadVisible: false
  },
  mutations: {
    TOGGLE_UPLOADVISIBLE: state => {
      state.uploadVisible = !state.uploadVisible
    }
  },
  actions: {
    ToggleUploadVisible: ({ commit }) => {
      commit('TOGGLE_UPLOADVISIBLE')
    }
  }

}

export default file
