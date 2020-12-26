import axios from 'axios';

const request = axios.create({
  timeout: 10000
});

request.interceptors.request.use(config => {

  const newConfig = {
    ...config,
    headers: {
      ...config.headers || {},
      'Content-type': 'application/json; charset=utf-8',
      Cookie: global.CONFIG.Cookie,
      "Accept": "application/json",
      'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36`,
    }
  };
  return newConfig
});

request.interceptors.response.use(
  res => {
    return res;
  },
  err => {
    console.log(`接口报错在request: ${err.request.path}`);
    return Promise.reject(err);
  }
);

export default request;
