import operationRecordService from '../base-service/record.js';

export default {
  getAllOperationRecord() {
    return operationRecordService('/getAllOperationRecord.do');
  }
};
