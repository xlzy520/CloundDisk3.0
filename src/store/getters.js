const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  uploadVisible: state => state.file.uploadVisible,
  fileList: state => state.file.fileList,
  folderNav: state => state.file.folderNav,
  detailVisible: state => state.file.detailVisible,
  selectedData: state => state.file.selectedData,
  versionVisible: state => state.file.versionVisible,
  parentId: state => state.file.parentId
}
export default getters
