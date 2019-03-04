import baseService from './base.js';

export default function authService(url, value, options) {
  return baseService(`/auth${url}`, value, options);
}
