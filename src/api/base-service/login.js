import baseService from './base.js';

export default function loginService(url, value, options) {
  let baseUrl = '/login';
  let service = baseUrl + url;
  return baseService(service, value, options);
}
