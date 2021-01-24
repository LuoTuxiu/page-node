import Koa from 'koa';
import koaBody from 'koa-body';
import 'module-alias/register'
import graceful from 'graceful'

// import ErrorHander from '@/middleware/ErrorHander';
// import AnalysicsHander from '@/middleware/AnalysicsHander';
import headerHandle from '@/middleware/headerHandle';
import controller from '@/controllers';
import config from '@/config';


// const pino = require('koa-pino-logger')({ prettyPrint: true})

const CONFIG = JSON.parse(require('fs').readFileSync('/Users/tuxiuluo/Desktop/config.json'))

global.CONFIG = CONFIG

const app = new Koa();
app.use(koaBody());

// ErrorHander.init(app, logger);
// AnalysicsHander.init(app);
headerHandle.init(app);
// app.use(pino)
// 初始化路由
controller.init(app);


// // 静态资源目录
// app.use(serve('client'));

// eslint-disable-next-line no-console
console.log(`server is running at : http://localhost:${config.serverPort}`);

// 全局异常捕获
// process.on('uncaughtException', err => {
//   logger.error(JSON.stringify(err));
// });

// 导出给 jest 测试
const server = app.listen(config.serverPort);
graceful({
	servers: [server],
	error: (error) => {
		console.log(`捕获到未捕获异常`);
		console.log(error);
	}
})
module.exports = server
