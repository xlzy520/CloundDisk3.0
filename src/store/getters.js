const getters = {
  sidebar: state => state.app.sidebar,
  selectedData: state => state.file.selectedData,
  actionArray: state => state.file.actionArray,
  authArr: state => state.file.authArr,
  userData: state => state.user.userData,
  authData: state => state.user.authData
};
export default getters;
