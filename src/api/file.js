import request from '@/utils/request'

export function getDocInfo(id) {
  return request({
    url: '/api_ldh/djcpsdocument/fileManager/getFile.do',
    method: 'get',
    params: { id: '20180829_RD_MARKDOWN_QKvut' }
  })
}

export function getCategory(id) {
  return request({
    url: '/api_py/djcpsdocument/category/getCategory.do',
    method: 'post',
    data: {
      fcategoryid: id
    }
  })
}

export function deleteCategory(categoryids, fparentid) {
  return request({
    url: '/api_py/djcpsdocument/category/deleteCategory.do',
    method: 'post',
    data: {
      list: categoryids,
      fparentid: fparentid
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

export function updateMarkdown(data) {
  return request({
    url: '/api_py/djcpsdocument/category/fileUpload.do',
    method: 'post',
    processData: false,
    contentType: false,
    data: data
  })
}

export function downloadFile(id) {
  return request({
    url: '/api_ldh/djcpsdocument/fileManager/downloadFile.do',
    method: 'get',
    params: { id }
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

