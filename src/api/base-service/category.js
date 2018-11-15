import baseService from './base.js';

export default function categoryService(url, value) {
  let baseUrl = '/category';
  let service = baseUrl + url;
  return baseService(service, value);
}
