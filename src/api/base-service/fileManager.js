import baseService from './base.js';

export default function fileManagerService(url, value, options) {
  let baseUrl = '/fileManager';
  let service = baseUrl + url;
  return baseService(service, value, options);
}
