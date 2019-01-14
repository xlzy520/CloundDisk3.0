import service from '../base-service/dingDingPush.js';

export default {
  getRecycleList(page) {
    return service('/selectRecycle.do', {pageSize: 20, pageNo: page});
  },
};
