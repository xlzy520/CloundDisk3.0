import axios from '@/utils/request';

export default function baseService(url, value, method = 'post') {
  let baseUrl = '/djcpsdocument';
  let service = baseUrl + url;
  if (method === 'post') {
    return axios.post(service, value);
  } else if (method === 'get') {
    return axios.get(service, {params: value});
  }
}
