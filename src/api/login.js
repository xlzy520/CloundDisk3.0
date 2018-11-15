import request from '@/utils/request';

export function login(name, password) {
  return request({
    url: '/djcpsdocument/login/adminlogin.do',
    method: 'post',
    data: {
      name,
      password
    }
  });
}

export function getInfo() {
  return request({
    url: '/djcpsdocument/login/getInfo.do',
    method: 'post'
  });
}

export function logout() {
  return request({
    url: 'djcpsdocument/login/loginout.do',
    method: 'post'
  });
}
