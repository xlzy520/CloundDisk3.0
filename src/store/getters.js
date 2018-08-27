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
  showBtn: state => state.file.showBtn,
  selectedData: state => state.file.selectedData,
  parentId: state => state.file.parentId,
  PreviewVisible: state => state.file.PreviewVisible,
  docValue: state => state.file.docValue
}
export default getters
