import baseService from './base.js';

export default function puthService(url, value, options) {
  return baseService(`/push${url}`, value, options);
}
