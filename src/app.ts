import Koa from 'koa';
import koaBody from 'koa-body';
import 'module-alias/register'; // 这个包是为了读取package.json里面的_moduleAliases去做alias

// import ErrorHander from '@/middleware/ErrorHander';
// import AnalysicsHander from '@/middleware/AnalysicsHander';
import headerHandle from '@/middleware/headerHandle';
import controller from '@/controllers';
import config from '@/config';
import PageSettingModel from '@/models/pageSettingModel';

const graceful = require('graceful');

const logger = require('koa-pino-logger');

const pino = logger({
  prettyPrint: {
    translateTime: true
  }
});

const getCookie = async () => {
  const result = await PageSettingModel.queryOne();
  return result;
};

getCookie().then(newConfig => {
  const { cookie_jianshu, cookie_juejin } = newConfig;
  global.Cookie = `${cookie_jianshu}${cookie_juejin}`;
});

const app = new Koa();
app.use(koaBody());

// ErrorHander.init(app, logger);
// AnalysicsHander.init(app);
headerHandle.init(app);

// 加打印log
app.use(pino);

// 初始化路由
controller.init(app);

// // 静态资源目录
// app.use(serve('client'));

// eslint-disable-next-line no-console
console.log(`server is running at : http://localhost:${config.serverPort}`);

// 全局异常捕获
process.on('uncaughtException', err => {
  // logger.error(JSON.stringify(err));
  pino(err);
});

// 导出给 jest 测试
const server = app.listen(config.serverPort);

// 捕获全局异常
graceful({
  servers: [server],
  error: error => {
    console.log(`捕获到未捕获异常`);
    console.log(error);
  }
});
module.exports = server;
