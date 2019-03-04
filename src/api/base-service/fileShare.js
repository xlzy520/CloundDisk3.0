import baseService from './base.js';

export default function fileService(url, value, options) {
  return baseService(`/fileShare${url}`, value, options);
}
