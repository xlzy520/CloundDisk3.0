const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  selectedData: state => state.file.selectedData,
  actionArray: state => state.file.actionArray,
};
export default getters;
