import request from '@/utils/request'

export function login(name, password) {
  return request({
    url: '/djcpsdocument/login/adminlogin.do',
    method: 'post',
    data: {
      name,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
