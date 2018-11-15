import fileManagerService from '../base-service/fileManager.js';

export function getOffice(params) {
  return fileManagerService('/getFileInfo.do', { ...params }, 'get');
}
