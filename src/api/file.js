import request from '@/utils/request'

export function getDocInfo(id) {
  return request({
    url: '/api_ldh/djcpsdocument/fileManager/getFile.do',
    method: 'get',
    params: { id }
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

export function deleteCategory(categoryids) {
  return request({
    url: '/api_py/djcpsdocument/category/deleteCategory.do',
    method: 'post',
    data: {
      list: categoryids
    }
  })
}

export function getVersionList(fname, id) {
  return request({
    url: '/api_lw/djcpsdocument/version/getAllVersion.do',
    method: 'post',
    data: {
      fname: fname,
      fcategoryid: id
    }
  })
}
export function versionRollback(oldVer, newVer) {
  return request({
    url: '/api_lw/djcpsdocument/version/versionBack.do',
    method: 'post',
    data: {
      oldDisplayFileSgin: oldVer,
      newDisplayFileSgin: newVer
    }
  })
}

export function uploadFile(parentId) {
  return request({
    url: '/api_py/djcpsdocument/category/fileUpload.do',
    method: 'post',
    data: {
      fparentId: parentId
    }
  })
}

export function addCategory(parentid, name) {
  return request({
    url: '/api_py/djcpsdocument/category/addCategory.do',
    method: 'post',
    data: {
      fparentid: parentid,
      fname: name
    }
  })
}

export function renameFile(fid, fname, fparentid) {
  return request({
    url: '/api_py/djcpsdocument/category/setCategoryName.do',
    method: 'post',
    data: {
      fcategoryid: fid,
      fname: fname,
      fparentid: fparentid
    }
  })
}
