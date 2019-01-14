import baseService from './base.js';

export default function versionService(url, value, options) {
  return baseService(`/version${url}`, value, options);
}
