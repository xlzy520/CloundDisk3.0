import fileManagerService from '../base-service/fileManager.js';

export default {
  getDocInfo(id) {
    return fileManagerService('/getFile.do', { id }, 'get');
  },
  downloadFile(id) {
    // return axios.get('/djcpsdocument/fileManager/downloadFile.do?id=' + id).then(res => {
    //   console.log(res);
    //   if (res.status === 200 || res.status === 0) {
    //     return Promise.resolve(res.data.blob());
    //   } else {
    //     return Promise.reject(new Error(res.statusText));
    //   }
    // });
    return fetch('/djcpsdocument/fileManager/downloadFile.do?id=' + id).then(res => {
      // console.log(res);
      if (res.status === 200 || res.status === 0) {
        return Promise.resolve(res.blob());
      } else {
        return Promise.reject(new Error(res.statusText));
      }
    });
  },
  // downloadFile(id) {
  //   return fileManagerService('/downloadFile.do', { id }, 'get');
  // },
  getOffice(params) {
    return fileManagerService('/getFileInfo.do', { ...params }, 'get');
  }
};
