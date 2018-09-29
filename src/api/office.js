import request from '@/utils/request'

export function getOffice(params) {
  return request({
    url: '/api_office/djcpsdocument/fileManager/getFileInfo.do',
    params: { ...params }
  })
}
