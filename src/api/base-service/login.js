import baseService from './base.js';

export default function loginService(url, value, options) {
  return baseService(`/login${url}`, value, options);
}
