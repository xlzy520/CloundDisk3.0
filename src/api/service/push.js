import pushService from '../base-service/push.js';

export default {
  // 分享文件弹框获取组织人员
  getUserInfoByOrgId (orgId) {
    return pushService('/getUserInfoByOrgId.do', { orgId }, 'get');
  },
};
