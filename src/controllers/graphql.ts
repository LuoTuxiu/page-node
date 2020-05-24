import { ApolloServer, gql, ApolloError, UserInputError } from 'apollo-server-koa';
import * as Koa from 'koa';
import { makeExecutableSchema } from 'graphql-tools';
import pageModel from '../models/pageModel';
import userModel from '../models/userModel';

interface Iyear {
  year: number;
}

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
  data: string;
  msg: string;
}

interface Ipvs {
  routerName: string;
}

function initGraphQL(app: Koa): void {
  const typeDefs = gql`
    type Page {
      _id: ID
      url: String
      content: String
      endTime: Int
      updatedTime: Int
      createdTime: Int
      title: String
      description: String
      keyword: String
    }

    type User {
      name: String
      passwd: String
      createdTime: Int
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
      pageList(page: Int, limit: Int): [Page]
      pageDetail(_id: String): Page
    }

    type Mutation {
      login(name: String, passwd: String): UserParams
      logout: ApiData
      register(name: String, passwd: String): ApiData
      updatePage(_id: String, url: String): ApiData
      addPage(url: String, content: String): ApiData
    }

    schema {
      query: Query
      mutation: Mutation
    }
  `;

  const resolvers = {
    Query: {
      pageList: async (_parent: never, args: any) => {
        let result: boolean | page.Item[];
        result = await pageModel.query(args);
        console.log(result);
        console.log('pageList');
        if (result.length > 0) {
          return result;
        }
        return false;
      },
      pageDetail: async (_parent: never, args: any) => {
        let result: page.Item;
        console.log('pageDetail');
        result = await pageModel.query(args);
        console.log(result);
        return result[0];
      },
      userInfo: async (_parent: never, args: any): Promise<any> => {
        let result: boolean | user.Info[];
        result = userModel.query(args);
        // if (result.length > 0) {
        // todo
        return { ...result[0], roles: ['admin'] };
        // }
        // return false;
      },
    },
    Mutation: {
      login: async (_parent: never, args: LoginParams): Promise => {
        console.log('进到这个查询语句了');
        let query = {};
        if (args) {
          const { name, passwd } = args;
          query = {
            name,
            passwd
          };
        }
        const findUser: user.Info[] = await userModel.query(query);
        if(findUser.length === 0) {
          throw new ApolloError('user error')
          // return Promise.reject(new Error('user error'))
        }
        return { ...findUser[0], token: new Date().getTime() };
      },
      logout: async (_parent: never, args: any): Promise => {
        const result: ApiData = {
          code: 200,
          data: '',
          msg: '退出成功'
        }
        return new Promise((resolve) => {
          resolve(result)
        })
      },
      register: async (
        _parent: never,
        args: RigisterParams
      ): Promise<ApiData> => {
        console.log(args);
        const registerStatus = await userModel.add(args);
        console.log(`registerStatus is ${registerStatus}`);
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
        })
          // throw new ApolloError('register error', 20008)
          // return Promise.reject(new Error('register error'))
        
      },
      updatePage: async (_parent: never, args: any): Promise => {
        const result = await pageModel.update({ _id: args.id }, args);
        console.log(result);
        return result;
      },
      addPage: async (_parent: never, args: any): Promise => {
        const result = await pageModel.add(args);
        console.log(result);
        return result;
      }
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
