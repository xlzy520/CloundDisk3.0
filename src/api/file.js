import request from '@/utils/request'

export function getDocInfo(id) {
  return request({
    url: '/api_ldh/djcpsdocument/fileManager/getFile.do',
    method: 'get',
    params: { id }
  })
}

export function getCategory(id) {
  return request({
    url: '/api_py/djcpsdocument/category/getCategory.do',
    method: 'post',
    data: {
      fcategoryid: id
    }
  })
}

export function deleteCategory(id) {
  return request({
    url: '/api_py/djcpsdocument/category/deleteCategory.do',
    method: 'post',
    data: {
      fcategoryid: id
    }
  })
}
