import fileManagerService from '../base-service/fileManager.js';

export default {
  getDocInfo(id) {
    return fileManagerService('/getFile.do', { id }, 'get');
  },
  downloadFile(id) {
    return fileManagerService('/downloadFile.do', { id }, 'get');
  }
};
