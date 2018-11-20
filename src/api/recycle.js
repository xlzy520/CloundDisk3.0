import request from '@/utils/request';

export function getRecycleList() {
  return request({
    url: '/djcpsdocument/category/selectRecycle.do',
    method: 'post'
  }).then(res => {
    for (let item of res.data) {
      item.fsize = item.fsize ? item.fsize : '';
    }
    return res;
  });
}

export function recycleRecover(categoryids) {
  return request({
    url: '/djcpsdocument/category/recycleRecover.do',
    method: 'post',
    data: {
      list: categoryids
    }
  });
}
export function recycleDelete(categoryids) {
  return request({
    url: '/djcpsdocument/category/recycleDelete.do',
    method: 'post',
    data: {
      list: categoryids
    }
  });
}
