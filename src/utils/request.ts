import axios from 'axios';

const request = axios.create({
  timeout: 10000
});

request.interceptors.request.use(config => {
  return {
    ...config,
    headers: {
      'Content-type': 'application/json;',
      Cookie: global.CONFIG.Cookie
    }
  };
});

request.interceptors.response.use(
  res => {
    return res;
  },
  err => {
    return Promise.reject(err);
  }
);

export default request;
