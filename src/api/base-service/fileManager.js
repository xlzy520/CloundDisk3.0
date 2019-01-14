import baseService from './base.js';

export default function fileManagerService(url, value, options) {
  return baseService(`/fileManager${url}`, value, options);
}
