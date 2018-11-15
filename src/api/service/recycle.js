import categoryService from '../base-service/category.js';

export function getRecycleList() {
  return categoryService('/selectRecycle.do');
}
export function recycleRecover(categoryids) {
  return categoryService('/recycleRecover.do', {list: categoryids});
}
export function recycleDelete(categoryids) {
  return categoryService('/recycleDelete.do', {list: categoryids});
}
