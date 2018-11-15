import baseService from './base.js';

export default function searchService(url, value) {
  let baseUrl = '/search';
  let service = baseUrl + url;
  return baseService(service, value);
}
