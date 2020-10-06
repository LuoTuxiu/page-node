import Router from 'koa-router';
import * as Koa from 'koa';
// eslint-disable-next-line import/no-extraneous-dependencies
import initGraphQL from './graphql';
import {juejinAddBlog} from '../auto-blog/juejin/juejin'
// import { listFiles } from '../auto-blog/localBlog/index';

const router = new Router();

export default {
  init(app: Koa): void {
    app.use(router.routes()).use(router.allowedMethods());
    initGraphQL(app);
    // getJuejinTags();
    // postJuejinDraft().then((data) => {
    //   console.log(data);
    //   postJuejinPublish();
    // });
    juejinAddBlog()
    // listFiles();
  }
};
