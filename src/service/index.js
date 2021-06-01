import axios from 'axios';

export function publish(data) {
  return axios.post('/data', data);
}
