import baseService from './base.js';

export default function operationRecordService(url, value, options) {
  return baseService(`/operationRecord${url}`, value, options);
}
