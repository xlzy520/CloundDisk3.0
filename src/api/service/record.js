import operationRecordService from '../base-service/operationRecord.js';

export default {
  getAllOperationRecord() {
    return operationRecordService('/getAllOperationRecord.do');
  }
};
