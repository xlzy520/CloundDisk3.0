import request from '@/utils/request'

export function getDocInfo(id) {
  return request({
    url: '/api_zhq/djcpsdocument/fileManager/getFile.do',
    method: 'get',
    params: { id }
  })
}

export function getCategory(id) {
  return request({
    url: '/api_zhq/djcpsdocument/category/getCategory.do',
    method: 'post',
    data: {
      fcategoryid: id
    }
  })
}

export function deleteCategory(categoryids) {
  return request({
    url: '/api_zhq/djcpsdocument/category/deleteCategory.do',
    method: 'post',
    data: {
      list: categoryids
    }
  })
}

export function getVersionList(fname, fparentid) {
  return request({
    url: '/api_zhq/djcpsdocument/version/getAllVersion.do',
    method: 'post',
    data: {
      fname: fname,
      fcategoryid: fparentid
    }
  })
}
export function versionRollback(oldVer, newVer) {
  return request({
    url: '/api_zhq/djcpsdocument/version/versionBack.do',
    method: 'post',
    data: {
      oldDisplayFileSgin: oldVer,
      newDisplayFileSgin: newVer
    }
  })
}

export function uploadFile(parentId) {
  return request({
    url: '/api_zhq/djcpsdocument/category/fileUpload.do',
    method: 'post',
    data: {
      fparentId: parentId
    }
  })
}

export function downloadFile(id) {
  return request({
    url: '/api_zhq/djcpsdocument/fileManager/downloadFile.do',
    method: 'post',
    data: {
      'id': id
    }
  })
}

export function addCategory(parentid, name) {
  return request({
    url: '/api_zhq/djcpsdocument/category/addCategory.do',
    method: 'post',
    data: {
      fparentid: parentid,
      fname: name
    }
  })
}

export function renameFile(fid, fname, fparentid) {
  return request({
    url: '/api_zhq/djcpsdocument/category/setCategoryName.do',
    method: 'post',
    data: {
      fcategoryid: fid,
      fname: fname,
      fparentid: fparentid
    }
  })
}

export function getSearchResult(queryString, categoryName, sort, curPage) {
  return request({
    url: '/api_oyny/djcpsdocument/search/list.do',
    method: 'post',
    data: {
      queryString: queryString,
      categoryName: categoryName,
      sort: 1,
      curPage: 1
    }
  })
}

