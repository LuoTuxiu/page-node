import Router from 'koa-router';
import * as Koa from 'koa';
// eslint-disable-next-line import/no-extraneous-dependencies
import initGraphQL from './graphql';

const router = new Router();

export default {
  init(app: Koa): void {
    app.use(router.routes()).use(router.allowedMethods());
    initGraphQL(app);
    // getAllLocalBlog();
  }
};
