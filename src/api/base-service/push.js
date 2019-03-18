import baseService from './base.js';

export default function pushService(url, value, options) {
  return baseService(`/push${url}`, value, options);
}
