import axios from 'axios';

export function publish(data, onDownloadProgress) {
  return axios.post('/data', data, {
    onDownloadProgress,
  });
}
