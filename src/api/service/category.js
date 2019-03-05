import categoryService from '../base-service/category.js';

export default {
  getCategory(id) {
    return categoryService('/getCategory.do', {fcategoryid: id}).then(res => {
      return res.data;
    });
  },
  addCategory(parentid, name) {
    return categoryService('/addCategory.do', {fparentid: parentid, fname: name});
  },
  deleteCategory(categoryids, fparentid) {
    return categoryService('/deleteCategory.do', {list: categoryids, fparentid: fparentid});
  },
  searchThisUserHavePers(fuserid) {
    return categoryService('/searchThisUserHavePers.do', { fuserid });
  }
};
