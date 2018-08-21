import { getCategory } from '@/api/file'
const file = {
  state: {
    list: []
  },
  mutations: {
    GET_CATEGORY: (state, data) => {
      state.list = data
    }
  },
  actions: {
     GetCategory({ commit }, fcategoryid) {
      new Promise((resolve, reject) => {
        // commit('GET_CATEGORY', await getCategory(fcategoryid))
        getCategory(fcategoryid).then(res => {
          commit('GET_CATEGORY', res.data)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default file
