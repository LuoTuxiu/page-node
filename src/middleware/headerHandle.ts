import * as Koa from 'koa';

const headerHander = {
  init(app: Koa): void {
    app.use(async (ctx: Koa.Context, next: Function) => {
      // console.log('在中间件这');
      await next();
    });
  }
};

export default headerHander;
