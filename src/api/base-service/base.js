import axios from '@/utils/request';

export default function baseService(url, value, method = 'post', options = {}) {
  const service = `/djcpsdocument${url}`;
  if (method === 'post') {
    return axios.post(service, value, options);
  } else if (method === 'get') {
    return axios.get(service, {params: value}, options);
  }
}
