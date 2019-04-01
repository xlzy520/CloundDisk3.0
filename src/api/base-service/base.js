import axios from '@/utils/request';

export default function baseService(url, value, method = 'post', options = {}) {
  if (method === 'post') {
    return axios.post(url, value, options);
  } else if (method === 'get') {
    return axios.get(url, {params: value}, options);
  }
}
