import categoryService from '../base-service/category.js';

export default {
  getRecycleList() {
    return categoryService('/selectRecycle.do');
  },
  recycleRecover(categoryids) {
    return categoryService('/recycleRecover.do', {list: categoryids});
  },
  recycleDelete(categoryids) {
    return categoryService('/recycleDelete.do', {list: categoryids});
  }
};
