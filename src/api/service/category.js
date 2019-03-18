import categoryService from '../base-service/category.js';

export default {
  getCategory(fcategoryid) {
    return categoryService('/getCategory.do', { fcategoryid }).then(res => {
      return res.data;
    });
  },
  addCategory(parentid, name) {
    return categoryService('/addCategory.do', {fparentid: parentid, fname: name});
  },
  deleteCategory(categoryids, fparentid) {
    return categoryService('/deleteCategory.do', {list: categoryids, fparentid: fparentid});
  },
  searchThisUserHavePersByPage(data) {
    return categoryService('/searchThisUserHavePersByPage.do', data);
  },
  getCommonCategory(fcategoryid) {
    return categoryService('/getCategory.do', { fcategoryid }, 'get');
  }
};
