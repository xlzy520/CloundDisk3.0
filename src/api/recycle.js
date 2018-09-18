import request from '@/utils/request'

export function getRecycleList() {
  return request({
    url: 'http://192.168.13.25:8081/djcpsdocument/category/selectRecycle.do',
    method: 'post'
  })
}
