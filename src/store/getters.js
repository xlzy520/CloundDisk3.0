const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,

  fileList: state => state.file.fileList,
  folderNav: state => state.file.folderNav,
  selectedData: state => state.file.selectedData,
  parentId: state => state.file.parentId,
  searchList: state => state.file.searchList,
  hasSearch: state => state.file.hasSearch,
  menuVisible: state => state.file.menuVisible,
  coordinate: state => state.file.coordinate
};
export default getters;
