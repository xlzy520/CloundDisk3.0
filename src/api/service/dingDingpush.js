import service from '../base-service/dingDingPush.js';

export default {
  getUserInfoByOrgId(keyword) {
    return service('/getUserInfoByOrgId.do', {...keyword}, 'get');
  },
  getRobotList() {
    return service('/getRobotList.do', {}, 'get');
  },
  addFoldPushMan(data) {
    return service('/addFoldPushMan.do', {...data});
  },
  getDingConfigInfo(id) {
    return service('/getDingConfigInfo.do', {foldId: id}, 'get');
  },
  updateFoldPushMan(data) {
    return service('/updateFoldPushMan.do', {...data});
  },
};
