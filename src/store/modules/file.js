import { getCategory } from '@/api/file'

const file = {
  state: {
    parentId: '-1',
    selectedData: [
      {
        'rowid': 100020,
        'fcategoryid': 'c9dd22ae-ff41-4ce9-9e48-690502f5b8d3',
        'fparentid': '1002',
        'foperator': 'panyang',
        'foperatorid': '1003',
        'ffiletype': 2,
        'fname': 'hehe',
        'fcategorystatus': 1,
        'fsortorder': 0,
        'fcreatetime': '2018-08-20 14:30:07.0',
        'fupdatetime': '2018-08-20 14:30:07.0'
      }
    ],
    uploadVisible: false,
    detailVisible: false,
    versionVisible: false,
    fileList: [],
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
    TOGGLE_DETAILVISIBLE: state => {
      state.detailVisible = !state.detailVisible
    },
    TOGGLE_VERSIONVISIBLE: state => {
      state.versionVisible = !state.versionVisible
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
    ToggleDetailVisible: ({ commit }) => {
      commit('TOGGLE_DETAILVISIBLE')
    },
    ToggleVersionVisible: ({ commit }) => {
      commit('TOGGLE_VERSIONVISIBLE')
    },
    async GetCategory({ commit }, fcategoryid) {
      // const Category = await getCategory(fcategoryid)
      commit('GET_CATEGORY', [{
        'rowid': 100004,
        'fcategoryid': 'c328517b-ddde-40a0-bb55-07f502efcccd',
        'fparentid': '1002',
        'foperator': 'panyang',
        'foperatorid': '1003',
        'ffiletype': 1,
        'fname': '团购文档',
        'fcategorystatus': 1,
        'fsortorder': 0,
        'fcreatetime': '2018-08-20 13:55:43.0',
        'fupdatetime': '2018-08-20 13:55:43.0'
      }, {
        'rowid': 100020,
        'fcategoryid': 'c9dd22ae-ff41-4ce9-9e48-690502f5b8d3',
        'fparentid': '1002',
        'foperator': 'panyang',
        'foperatorid': '1003',
        'ffiletype': 1,
        'fname': 'hehe',
        'fcategorystatus': 1,
        'fsortorder': 0,
        'fcreatetime': '2018-08-20 14:30:07.0',
        'fupdatetime': '2018-08-20 14:30:07.0'
      }, {
        'rowid': 100021,
        'fcategoryid': '9d1420d3-e943-48ae-96e9-4d55c1b9c9be',
        'fparentid': '1002',
        'foperator': 'panyang',
        'foperatorid': '1003',
        'ffiletype': 1,
        'fname': 'hehe',
        'fcategorystatus': 1,
        'fsortorder': 0,
        'fcreatetime': '2018-08-20 14:43:11.0',
        'fupdatetime': '2018-08-20 14:43:11.0'
      }, {
        'rowid': 100022,
        'fcategoryid': '4e62ce11-d9f4-4c67-aae9-930d8b3ff585',
        'fparentid': '1002',
        'foperator': 'panyang',
        'foperatorid': '1003',
        'ffiletype': 1,
        'fname': 'hehe',
        'fcategorystatus': 1,
        'fsortorder': 0,
        'fcreatetime': '2018-08-20 15:03:37.0',
        'fupdatetime': '2018-08-20 15:03:37.0'
      }])
    },
    async Refresh({ commit }) {
      const Category = await getCategory(this.state.parentId)
      commit('GET_CATEGORY', Category.data)
    }
  }
}

export default file
