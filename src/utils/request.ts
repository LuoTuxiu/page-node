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
      Cookie: global.Cookie,
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
    if (err.request) {
      console.warn(`接口报错在request: ${err.request.path} 原因是 错误码是：${err.response.status}，错误原因是${err.response.statusText}`);
    }
    return Promise.resolve(err);
  }
);

export default request;
