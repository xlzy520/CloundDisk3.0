import categoryService from '../base-service/category.js';

export default {
  getRecycleList(page) {
    return categoryService('/selectRecycle.do', {
      pageSize: 20,
      pageNo: page
    });
  },
  recycleRecover(categoryids) {
    return categoryService('/recycleRecover.do', {list: categoryids});
  },
  recycleDelete(categoryids) {
    return categoryService('/recycleDelete.do', {list: categoryids});
  }
};
