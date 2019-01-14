import baseService from './base.js';

export default function categoryService(url, value, options) {
  return baseService(`/category${url}`, value, options);
}
