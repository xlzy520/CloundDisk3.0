import baseService from './base.js';

export default function dingDingPushService(url, value, options) {
  return baseService(`/push${url}`, value, options);
}
