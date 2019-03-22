const getters = {
  sidebar: state => state.app.sidebar,
  selectedData: state => state.file.selectedData,
  actionArray: state => state.file.actionArray,
  userData: state => state.user.userData,
  authData: state => state.user.authData,
  employee: state => state.user.employee,
  employeeAuth: state => state.user.employeeAuth,
  authList: state => state.user.authList
};
export default getters;
