const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,

  upload: state => state.file.upload,
  deleteVisible: state => state.file.deleteVisible,
  detailVisible: state => state.file.detailVisible,
  versionVisible: state => state.file.versionVisible,
  fileList: state => state.file.fileList,
  folderNav: state => state.file.folderNav,
  selectedData: state => state.file.selectedData,
  parentId: state => state.file.parentId,
  PreviewVisible: state => state.file.PreviewVisible,
  docValue: state => state.file.docValue,
  searchList: state => state.file.searchList,
  hasSearch: state => state.file.hasSearch,
  menuVisible: state => state.file.menuVisible,
  coordinate: state => state.file.coordinate
}
export default getters
