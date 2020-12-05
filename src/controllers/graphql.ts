import {
  ApolloServer,
  gql,
  ApolloError,
  UserInputError
} from 'apollo-server-koa';
import * as Koa from 'koa';
import { makeExecutableSchema } from 'graphql-tools';
import pageModel from '../models/pageModel';
import userModel from '../models/userModel';
import { updateBlogFiles } from '../auto-blog/localBlog';
import { juejinAddBlog, deleteJuejinBlog, updateJuejin } from '../auto-blog/juejin/juejin';

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
  const typeDefs = gql`
    type Page {
      pageId: String
      grouping: String
      url: String
      content: String
      endTime: String
      updateTime: String
      createTime: String
      title: String
      description: String
      keyword: String
      originPath: String
      category: [String]
      juejin_id: String
    }

    type Pages {
      total: Int
      list: [Page]
    }

    type User {
      name: String
      passwd: String
      createTime: Int
      roles: [String]
    }

    type UserParams {
      name: String
      passwd: String
      token: String
    }

    type PageParams {
      page: String
      limit: String
    }

    type ApiData {
      code: Int
      data: String
      msg: String
    }

    type Query {
      userInfo: User
      pageList(page: Int, limit: Int): Pages
      pageDetail(pageId: String): Page
      blogList: [Page]
    }

    input NewPage {
      grouping: String
      content: String
      title: String
    }

    type Mutation {
      login(name: String, passwd: String): UserParams
      logout: ApiData
      register(name: String, passwd: String): ApiData
      addPage(input: NewPage): ApiData
      updateLocalBlog: ApiData
      publishJuejinBlog(pageId: String, content: String): ApiData
      updateJuejinBlog(pageId: String, juejin_id: String): ApiData
      deleteJuejinBlog(pageId: String, juejin_id: String): ApiData
      updatePage(pageId: String, content: String, title: String): ApiData
      addToLocal(grouping: String, content: String): ApiData
      deletePage(pageId: String): ApiData
    }

    schema {
      query: Query
      mutation: Mutation
    }
  `;

  const resolvers = {
    Query: {
      pageList: async (_parent: never, args: any) => {
        const result: boolean | page.Item[] = await pageModel.query(args);
        return result;
      },
      pageDetail: async (_parent: never, args: any) => {
        const result: page.Item = await pageModel.queryOne(args);
        return result;
      },
      userInfo: async (_parent: never, args: any): Promise<any> => {
        const result: boolean | user.Info[] = userModel.query(args);
        // if (result.length > 0) {
        // todo
        return { ...result[0], roles: ['admin'] };
        // }
        // return false;
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
        const result = await pageModel.updatePage(args);
        return result;
      },
      addPage: async (_parent: never, args: any): Promise => {
        const result = await pageModel.addPage(args.input);
        return result;
      },
      deletePage: async(_parent: never, args: any):Promies => {
        const result = await pageModel.deletePage(args)
        return result
      },
      updateLocalBlog: async () => {
        // const result = await updateBlogFiles();
        // return result;
      },
      publishJuejinBlog: async (_parent: never, args: any) => {
        const result = await juejinAddBlog(args);
        await pageModel.updatePage(result);
        return result;
      },
      updateJuejinBlog: async (_parent: never, args: any) => {
        const result = await updateJuejin(args);
        await pageModel.updatePage(result);
        return result;
      },
      deleteJuejinBlog: async (_parent: never, args: any) => {
        const result = await deleteJuejinBlog({ ...args });
        return result;
      },
    }
  };

  const myGraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers
  });
  const server = new ApolloServer({ schema: myGraphQLSchema });
  server.applyMiddleware({ app });
}

export default initGraphQL;
