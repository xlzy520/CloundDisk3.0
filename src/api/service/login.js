import loginService from '../base-service/login.js';

export function login(name, password) {
  return loginService('/adminlogin.do', {name, password});
}

export function getInfo() {
  return loginService('/getInfo.do');
}

export function logout() {
  return loginService('/loginout.do');
}
