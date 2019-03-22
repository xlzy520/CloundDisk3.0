const getters = {
  sidebar: state => state.app.sidebar,
  selectedData: state => state.file.selectedData,
  actionArray: state => state.file.actionArray,
  userData: state => state.user.userData,
};
export default getters;
