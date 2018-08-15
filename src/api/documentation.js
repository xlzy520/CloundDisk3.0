import request from '@/utils/request'

export function getDocInfo(id) {
  return request({
    url: '/api_ldh/djcpsdocument/fileManager/previewFile.do',
    method: 'get',
    params: { id }
  })
}
