import fileManagerService from '../base-service/fileManager.js';

export default {
  getOffice(params) {
    return fileManagerService('/getFileInfo.do', { ...params }, 'get');
  }
};
