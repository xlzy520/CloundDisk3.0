import categoryService from '../base-service/category.js';
import fileManagerService from '../base-service/fileManager.js';
import versionService from '../base-service/version.js';
import searchService from '../base-service/search.js';

// category
export function getCategory(id) {
  return categoryService('/getCategory.do', {fcategoryid: id});
}
export function addCategory(parentid, name) {
  return categoryService('/addCategory.do', {fparentid: parentid, fname: name});
}
export function deleteCategory(categoryids, fparentid) {
  return categoryService('/deleteCategory.do', {list: categoryids, fparentid: fparentid});
}
export function moveFile(idList, fparentid) {
  return categoryService('/floderMove.do', {list: idList, fparentid: fparentid});
}
export function copyFile(idList, fparentid) {
  return categoryService('/copyFile.do', {list: idList, fparentid: fparentid});
}
export function renameFile(values) {
  const { fcategoryid, newName, fparentid, ffiletype, fname } = values;
  return categoryService('/setCategoryName.do', {
    fcategoryid,
    oldName: fname,
    fname: newName,
    fparentid,
    ffiletype
  });
}

// export function updateMarkdown(data) {
//   return request({
//     url: '/djcpsdocument/category/fileUpload.do',
//     method: 'post',
//     processData: false,
//     contentType: false,
//     data: data
//   });
// }

// version
export function getVersionList(fversionsign) {
  return versionService('/getAllVersion.do', {fvsgin: fversionsign});
}
export function versionRollback(oldVer, newVer) {
  return versionService('/versionBack.do', {oldDisplayFileSgin: oldVer, newDisplayFileSgin: newVer});
}
// search
export function getSearchResult(queryString, categoryName) {
  return searchService('/list.do', {queryString: queryString, categoryName: categoryName, sort: 1, curPage: 1});
}
export function getFullTextSearchResult(queryString, categoryName) {
  return searchService('/fullList.do', {queryString: queryString, categoryName: categoryName, sort: 1, curPage: 1});
}
// fileManager
export function getDocInfo(id) {
  return fileManagerService('/getFile.do', { id }, 'get');
}
export function downloadFile(id) {
  return fileManagerService('/downloadFile.do', { id }, 'get');
}

