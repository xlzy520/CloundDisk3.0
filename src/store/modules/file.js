const file = {
  state: {
    selectedData: [],
    actionArray: []
  },
  mutations: {
    SET_SELECTED_DATA: (state, data) => {
      state.selectedData = data;
    },
    SET_ACTION_ARRAY: (state, data) => {
      state.actionArray = data;
    }
  },
  actions: {
    SetSelectedData({ commit }, data) {
      commit('SET_SELECTED_DATA', data);
    },
    changeActionArray({ commit }, data) {
      commit('SET_ACTION_ARRAY', data);
    }
  }
};
export default file;
