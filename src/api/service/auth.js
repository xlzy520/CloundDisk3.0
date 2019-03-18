import aushService from '../base-service/auth.js';
import authService from '../base-service/auth.js';

export default {
  getOrgList() {
    return aushService('/getOrgList.do', {}, 'get');
  },
  // 分配权限目录获取组织人员
  getExcludeUserInfoByOrgId(orgId, fcategoryid) {
    return aushService('/getExcludeUserInfoByOrgId.do', { orgId, fcategoryid }, 'get');
  },
  getAuthListByCategory(data) {
    return aushService('/getAuthListByCategory.do', data);
  },
  // 分配权限
  giveAuthToUser(data) {
    return aushService('/giveAuthToUser.do', data);
  },
  // 查询单个人员的权限
  searchThisCateWhoHavePer(data) {
    return aushService('/searchThisCateWhoHavePer.do', data);
  },
  // 删除某个人的权限
  delUserAuth(data) {
    return authService('/delUserAuth.do', data);
  },
  // 更新某个人的权限
  updateUserAuth(data) {
    return aushService('/updateUserAuth.do', data);
  }
};
