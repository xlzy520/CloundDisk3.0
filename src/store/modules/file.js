const file = {
  state: {
    uploadVisible: false
  },
  mutations: {
    TOGGLE_UPLOADVISIBLE: state => {
      if (state.uploadVisible) {
        state.uploadVisible = false
      } else {
        state.uploadVisible = true
      }
    }
  },
  actions: {
    ToggleUploadVisible: ({ commit }) => {
      commit('TOGGLE_UPLOADVISIBLE')
    }
  }

}

export default file
