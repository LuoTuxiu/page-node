const mongoDBHost =
  process.env.BUILD_ENV === 'docker'
    ? 'mongodb://database/user'
    : 'mongodb://localhost/user';

export default {
  spiderDomain: '',
  serverPort: 3001,
  // 和 docker-compose 里的 mongo 容器相对应
  databaseUrl: mongoDBHost
};
