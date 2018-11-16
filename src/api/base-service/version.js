import baseService from './base.js';

export default function versionService(url, value, options) {
  let baseUrl = '/version';
  let service = baseUrl + url;
  return baseService(service, value, options);
}
