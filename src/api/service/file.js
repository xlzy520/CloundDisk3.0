import categoryService from '../base-service/category.js';
import fileManagerService from '../base-service/fileManager.js';
import versionService from '../base-service/version.js';
import searchService from '../base-service/search.js';

export default {
  // category
  getCategory(id) {
    return categoryService('/getCategory.do', {fcategoryid: id});
  },
  addCategory(parentid, name) {
    return categoryService('/addCategory.do', {fparentid: parentid, fname: name});
  },
  deleteCategory(categoryids, fparentid) {
    return categoryService('/deleteCategory.do', {list: categoryids, fparentid: fparentid});
  },
  moveFile(idList, fparentid) {
    return categoryService('/floderMove.do', {list: idList, fparentid: fparentid});
  },
  copyFile(idList, fparentid) {
    return categoryService('/copyFile.do', {list: idList, fparentid: fparentid});
  },
  renameFile(values) {
    const { fcategoryid, newName, fparentid, ffiletype, fname } = values;
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
  // fileManager
  getDocInfo(id) {
    return fileManagerService('/getFile.do', { id }, 'get');
  },
  downloadFile(id) {
    return fileManagerService('/downloadFile.do', { id }, 'get');
  }
};
