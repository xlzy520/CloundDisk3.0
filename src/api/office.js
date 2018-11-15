import request from '@/utils/request';

export function getOffice(params) {
  return request({
    url: '/djcpsdocument/fileManager/getFileInfo.do',
    params: { ...params }
  });
}
