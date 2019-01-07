import categoryService from '../base-service/category.js';
import fileManagerService from '../base-service/fileManager.js';
import versionService from '../base-service/version.js';
import searchService from '../base-service/search.js';
import axios from 'axios';

export default {
  moveFile(idList, fparentid) {
    return categoryService('/floderMove.do', {list: idList, fparentid: fparentid});
  },
  copyFile(idList, fparentid) {
    return categoryService('/copyFile.do', {list: idList, fparentid: fparentid});
  },
  renameFile({fcategoryid, newName, fparentid, ffiletype, fname }) {
    return categoryService('/setCategoryName.do', {
      fcategoryid,
      oldName: fname,
      fname: newName,
      fparentid,
      ffiletype
    });
  },
  updateMarkdown(data) {
    return categoryService('/fileUpload.do', data, 'post', {processData: false, contentType: false});
  },
  // version
  getVersionList(fversionsign) {
    return versionService('/getAllVersion.do', {fvsgin: fversionsign});
  },
  versionRollback(oldVer, newVer) {
    return versionService('/versionBack.do', {oldDisplayFileSgin: oldVer, newDisplayFileSgin: newVer});
  },
  // search
  getSearchResult(queryString) {
    return searchService('/list.do', {queryString: queryString, sort: 1, curPage: 1});
  },
  getFullTextSearchResult(queryString) {
    return searchService('/fullList.do', {queryString: queryString, sort: 1, curPage: 1});
  },
  downloadFile(id, responseType = '') {
    // 跳过统一接口请求错误处理
    return axios.get('/djcpsdocument/fileManager/downloadFile.do', {params: {id: id}}, {
      responseType: responseType
    }).then(res => {
      return res.request.response;
    }).catch(err=>{
      return new Error(err);
    });
  },
  downloadZip(idList) {
    return axios.post('/djcpsdocument/fileManager/zipDownload.do', idList, {
      responseType: 'blob'
    }).then(res => {
      return Promise.resolve(res.data);
    }).catch(err=>{
      return Promise.reject(new Error(err));
    });
  },
  //office
  getOffice(params) {
    return fileManagerService('/getFileInfo.do', { ...params }, 'get');
  }
};
