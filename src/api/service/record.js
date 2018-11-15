import operationRecordService from '../base-service/operationRecord.js';

export function getAllOperationRecord() {
  return operationRecordService('/getAllOperationRecord.do');
}
