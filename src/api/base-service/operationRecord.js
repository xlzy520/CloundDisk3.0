import baseService from './base.js';

export default function operationRecordService(url, value) {
  let baseUrl = '/operationRecord';
  let service = baseUrl + url;
  return baseService(service, value);
}
