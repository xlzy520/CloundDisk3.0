import axios from '@/utils/request';

export default function baseService(url, value, method = 'post', options = {}) {
  let baseUrl = '/djcpsdocument';
  let service = baseUrl + url;
  if (method === 'post') {
    return axios.post(service, value, options);
  } else if (method === 'get') {
    return axios.get(service, {params: value});
  }
}
