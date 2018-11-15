import baseService from './base.js';

export default function loginService(url, value) {
  let baseUrl = '/login';
  let service = baseUrl + url;
  return baseService(service, value);
}
