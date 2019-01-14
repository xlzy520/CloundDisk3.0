import baseService from './base.js';

export default function searchService(url, value, options) {
  return baseService(`/search${url}`, value, options);
}
