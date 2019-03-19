const getters = {
  sidebar: state => state.app.sidebar,
  selectedData: state => state.file.selectedData,
  actionArray: state => state.file.actionArray,
  authArr: state => state.file.authArr,
  userData: state => state.user.userData,
  authData: state => state.user.authData,
  groupNum: state => state.user.groupNum,
  employee: state => state.user.employee,
  employeeAuth: state => state.user.employeeAuth,
  authList: state => state.user.authList
};
export default getters;
