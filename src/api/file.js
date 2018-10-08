import request from '@/utils/request'

export function getDocInfo(id) {
  return request({
    url: '/djcpsdocument/fileManager/getFile.do',
    method: 'get',
    params: { id }
  })
}

export function getCategory(id) {
  return request({
    url: '/djcpsdocument/category/getCategory.do',
    method: 'post',
    data: {
      fcategoryid: id
    }
  })
}

export function deleteCategory(categoryids, fparentid) {
  return request({
    url: '/djcpsdocument/category/deleteCategory.do',
    method: 'post',
    data: {
      list: categoryids,
      fparentid: fparentid
    }
  })
}

export function getVersionList(fversionsign) {
  return request({
    url: '/djcpsdocument/version/getAllVersion.do',
    method: 'post',
    data: {
      fvsgin: fversionsign
    }
  })
}
export function versionRollback(oldVer, newVer) {
  return request({
    url: '/djcpsdocument/version/versionBack.do',
    method: 'post',
    data: {
      oldDisplayFileSgin: oldVer,
      newDisplayFileSgin: newVer
    }
  })
}

export function updateMarkdown(data) {
  return request({
    url: '/djcpsdocument/category/fileUpload.do',
    method: 'post',
    processData: false,
    contentType: false,
    data: data
  })
}

export function downloadFile(id) {
  return request({
    url: '/djcpsdocument/fileManager/downloadFile.do',
    method: 'get',
    params: { id }
  })
}

export function addCategory(parentid, name) {
  return request({
    url: '/djcpsdocument/category/addCategory.do',
    method: 'post',
    data: {
      fparentid: parentid,
      fname: name
    }
  })
}

export function renameFile(fid, oldName, fname, fparentid, ffiletype) {
  return request({
    url: '/djcpsdocument/category/setCategoryName.do',
    method: 'post',
    data: {
      fcategoryid: fid,
      fname: fname,
      oldName: oldName,
      fparentid: fparentid,
      ffiletype: ffiletype
    }
  })
}

export function getSearchResult(queryString, categoryName, sort, curPage) {
  return request({
    url: '/djcpsdocument/search/list.do',
    method: 'post',
    data: {
      queryString: queryString,
      categoryName: categoryName,
      sort: 1,
      curPage: 1
    }
  })
}
export function getFullTextSearchResult(queryString, categoryName, sort, curPage) {
  return request({
    url: '/djcpsdocument/search/fullList.do',
    method: 'post',
    data: {
      queryString: queryString,
      categoryName: categoryName,
      sort: 1,
      curPage: 1
    }
  })
}
export function moveFile(idList, fparentid) {
  return request({
    url: '/djcpsdocument/category/floderMove.do',
    method: 'post',
    data: {
      list: idList,
      fparentid: fparentid
    }
  })
}
export function copyFile(idList, fparentid) {
  return request({
    url: '/djcpsdocument/category/copyFile.do',
    method: 'post',
    data: {
      list: idList,
      fparentid: fparentid
    }
  })
}
