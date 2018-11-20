import loginService from '../base-service/login.js';

export default {
  login(name, password) {
    return loginService('/adminlogin.do', {name, password});
  },
  getInfo() {
    return loginService('/getInfo.do');
  },
  logout() {
    return loginService('/loginout.do');
  },
};
