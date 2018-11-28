const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  selectedData: state => state.file.selectedData,
  searchList: state => state.file.searchList,
  hasSearch: state => state.file.hasSearch
};
export default getters;
