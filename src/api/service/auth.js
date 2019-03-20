import authService from '../base-service/auth.js';

export default {
  getOrgList() {
    return authService('/getOrgList.do', {}, 'get');
  },
  // 分配权限目录获取组织人员
  getExcludeUserInfoByOrgId(orgId, fcategoryids) {
    return authService('/getExcludeUserInfoByOrgId.do', { orgId, fcategoryids });
  },
  getAuthListByCategory(data) {
    return authService('/getAuthListByCategory.do', data);
  },
  // 分配权限
  giveAuthToUser(data) {
    return authService('/giveAuthToUser.do', data);
  },
  // 查询单个人员的权限
  searchThisCateWhoHavePer(data) {
    return authService('/searchThisCateWhoHavePer.do', data);
  },
  // 删除某个人的权限
  delUserAuth(data) {
    return authService('/delUserAuth.do', data);
  },
  // 更新某个人的权限
  updateUserAuth(data) {
    return authService('/updateUserAuth.do', data);
  }
};
