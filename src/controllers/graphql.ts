import { ApolloServer, ApolloError, UserInputError } from 'apollo-server-koa';
import * as Koa from 'koa';
import { applyMiddleware } from 'graphql-middleware';
import { makeExecutableSchema } from 'graphql-tools';
import pageModel from '@/models/pageModel';
import CategoryModel from '@/models/categoryModel';
import PageSettingModel from '@/models/pageSettingModel';
import userModel from '@/models/userModel';
import {
  updateLocalBlog,
  deleteLocalBlog,
  addLocalBlog
} from '@/auto-blog/localBlog';
import {
  jianshuAddBlog,
  deleteJianshuBlog,
  getJianshuArticleList,
  updateJianshu
} from '@/auto-blog/jianshu/jianshu';
import {
  juejinAddBlog,
  deleteJuejinBlog,
  updateJuejin
} from '@/auto-blog/juejin/juejin';
import typeDefs from './graphqlType';

interface LoginParams {
  name: string;
  passwd: string;
}

interface RigisterParams {
  name: string;
  passwd: string;
}

interface ApiData {
  code: number;
  data: string | object | null;
  msg: string;
}

function initGraphQL(app: Koa): void {
  const resolvers = {
    Query: {
      pageList: async (_parent: never, args: any) => {
        const result: boolean | page.Item[] = await pageModel.query(args);
        return result;
      },
      jianshuList: async (_parent: never, args: any) => {
        const result: boolean | page.Item[] = await getJianshuArticleList(args);
        return result;
      },
      categoryList: async (_parent: never, args: any) => {
        const result: boolean | page.CategoryItem[] = await CategoryModel.query(
          args
        );
        return result;
      },
      categoryAll: async (_parent: never, args: any) => {
        const result:
          | boolean
          | page.CategoryItem[] = await CategoryModel.queryAll(args);
        return result;
      },
      pageDetail: async (_parent: never, args: any) => {
        const result = await pageModel.queryOne(args);
        if (!result) {
          console.log(`进入报错`);
          throw new ApolloError('user error', 10001);
          throw new Error('get detail error');
        }
        return result;
      },
      userInfo: async (_parent: never, args: any): Promise<any> => {
        const result: boolean | user.Info[] = userModel.query(args);
        // if (result.length > 0) {
        // todo
        return { ...result[0], roles: ['admin'] };
        // }
        // return false;
      },
      getPageSetting: async (_parent: never, args: any) => {
        const result = await PageSettingModel.queryOne();
        return result;
      }
    },
    Mutation: {
      login: async (_parent: never, args: LoginParams) => {
        let query = {};
        if (args) {
          const { name, passwd } = args;
          query = {
            name,
            passwd
          };
        }
        const findUser: user.Info[] = await userModel.query(query);
        if (findUser.length === 0) {
          throw new ApolloError('user error');
          // return Promise.reject(new Error('user error'))
        }
        return { ...findUser[0], token: new Date().getTime() };
      },
      logout: async (_parent: never, args: any) => {
        const result: ApiData = {
          code: 200,
          data: '',
          msg: '退出成功'
        };
        return new Promise(resolve => {
          resolve(result);
        });
      },
      register: async (
        _parent: never,
        args: RigisterParams
      ): Promise<ApiData> => {
        const registerStatus = await userModel.add(args);
        if (registerStatus) {
          const result: ApiData = {
            code: 200,
            data: '',
            msg: '注册成功'
          };
          return new Promise(resolve => {
            resolve(result);
          });
        }
        throw new UserInputError('some require', {
          // code: 20008
          invalidArgs: 'name'
        });
        // throw new ApolloError('register error', 20008)
        // return Promise.reject(new Error('register error'))
      },
      updatePage: async (_parent: never, args: any): Promise => {
        const result = await pageModel.update(args);
        return result;
      },
      addPage: async (_parent: never, args: any): Promise => {
        const result = await pageModel.add(args.input);
        return result;
      },
      deletePage: async (_parent: never, args: any): Promies => {
        const result = await pageModel.remove(args);
        return result;
      },
      updateLocalBlog: async (_parent: never, args: any) => {
        const result = await updateLocalBlog(args);
        await pageModel.update(result);
        return result;
      },
      addLocalBlog: async (_parent: never, args: any) => {
        const result = await addLocalBlog(args);
        await pageModel.update(result);
        return result;
      },
      deleteLocalBlog: async (_parent: never, args: any): Promies => {
        const result = await deleteLocalBlog(args);
        await pageModel.update(result);
        return result;
      },
      publishJuejinBlog: async (_parent: never, args: any) => {
        const result = await juejinAddBlog(args);
        await pageModel.update(result);
        return result;
      },
      updateJuejinBlog: async (_parent: never, args: any) => {
        const result = await updateJuejin(args);
        await pageModel.update(result);
        return result;
      },
      updateJianshuBlog: async (_parent, args) => {
        const result = await updateJianshu(args);
        await pageModel.update(result);
        return result;
      },
      deleteJuejinBlog: async (_parent: never, args: any) => {
        const result = await deleteJuejinBlog({ ...args });
        return result;
      },
      publishJianshuBlog: async (_parent: never, args: any) => {
        const [err, data] = await jianshuAddBlog(args);
        if (!err) {
          await pageModel.update(data);
        } else {
          throw new ApolloError(err.message, err.code);
          // throw err
        }
      },
      deleteJianshuBlog: async (_parent: never, args: any) => {
        const result = await deleteJianshuBlog({ ...args });
        return result;
      },
      addCategory: async (_parent: never, args: any): Promise => {
        const result = await CategoryModel.addCategory(args.input);
        return result;
      },
      deleteCategory: async (_parent: never, args: any): Promies => {
        const result = await CategoryModel.deleteCategory(args);
        return result;
      },
      updateCategory: async (_parent: never, args: any): Promise => {
        const result = await CategoryModel.updateCategory(args);
        return result;
      },
      addCategoryJianshu: async (_parent: never, args: any): Promise => {
        const result = await CategoryModel.addCategoryJianshu(args.input);
        return result;
      },
      updatePageSetting: async (_parent: never, args: any): Promise => {
        const result = await PageSettingModel.updatePageSetting(args.input);
        return result;
      }
    }
  };

  const beepMiddleware = {
    Query: {
      pageDetail: async (resolve, parent, args, context, info) => {
        // You can use middleware to override arguments
        const argsWithDefault = { name: 'Bob', ...args };
        const result = await resolve(parent, argsWithDefault, context, info);
        // Or change the returned values of resolvers
        return result;
        // return result.replace(/Trump/g, 'beep')
        // return {error: 222}
      }
    }
  };

  const myGraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers
    // middlewares: [logInput],
  });
  const schemaWithMiddleware = applyMiddleware(myGraphQLSchema, beepMiddleware);
  const server = new ApolloServer({ schema: myGraphQLSchema });
  server.applyMiddleware({ app });
}

export default initGraphQL;
