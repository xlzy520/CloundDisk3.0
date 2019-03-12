import fileService from '../base-service/fileShare';

export default {
  shareFile(data) {
    return fileService('/shareFile.do', data);
  },
};
