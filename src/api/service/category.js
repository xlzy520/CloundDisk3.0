import categoryService from '../base-service/category.js';

export default {
  getCategory(id) {
    return categoryService('/getCategory.do', {fcategoryid: id});
  },
  addCategory(parentid, name) {
    return categoryService('/addCategory.do', {fparentid: parentid, fname: name});
  },
  deleteCategory(categoryids, fparentid) {
    return categoryService('/deleteCategory.do', {list: categoryids, fparentid: fparentid});
  },
  moveFile(idList, fparentid) {
    return categoryService('/floderMove.do', {list: idList, fparentid: fparentid});
  },
  copyFile(idList, fparentid) {
    return categoryService('/copyFile.do', {list: idList, fparentid: fparentid});
  },
  renameFile(values) {
    const { fcategoryid, newName, fparentid, ffiletype, fname } = values;
    return categoryService('/setCategoryName.do', {
      fcategoryid,
      oldName: fname,
      fname: newName,
      fparentid,
      ffiletype
    });
  },
  updateMarkdown(data) {
    return categoryService('/fileUpload.do', data, 'post', {processData: false, contentType: false});
  },
};
