import * as Koa from 'koa';

const headerHander = {
  init(app: Koa): void {
    app.use(async (ctx: Koa.Context, next: Function) => {
      console.log(ctx.request.body);
      await next();
    });
  }
};

export default headerHander;
