import categoryService from '../base-service/category.js';

export default {
  getRecycleList(page) {
    return categoryService('/selectRecycle.do', {pageSize: 20, pageNo: page});
  },
  recycleRecover(ids) {
    return categoryService('/recycleRecover.do', {list: ids});
  },
  recycleDelete(ids) {
    return categoryService('/recycleDelete.do', {list: ids});
  }
};
