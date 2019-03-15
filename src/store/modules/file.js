const file = {
  state: {
    selectedData: [],
    actionArray: [],
    authArr: [],
  },
  mutations: {
    SET_SELECTED_DATA: (state, data) => {
      state.selectedData = data;
    },
    SET_ACTION_ARRAY: (state, data) => {
      state.actionArray = data;
    },
    SET_AUTH_ARR: (state, data) => {
      state.authArr = data;
    }
  },
  actions: {
    SetSelectedData({ commit }, data) {
      commit('SET_SELECTED_DATA', data);
    },
    SetAuthArr({ commit }, data) {
      commit('SET_AUTH_ARR', data);
    },
    changeActionArray({ commit }, data) {
      commit('SET_ACTION_ARRAY', data);
    }
  }
};
export default file;
