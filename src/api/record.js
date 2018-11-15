import request from '@/utils/request';

export function getAllOperationRecord() {
  return request({
    url: 'djcpsdocument/operationRecord/getAllOperationRecord.do',
    method: 'post'
  });
}
