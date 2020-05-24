# page-node

一个 nodejs + mongoodb + apollo + graphql 服务端 demo，对应的前端代码是

[auto-page-web](https://github.com/LuoTuxiu/auto-page-web)

1. 启动 mongod

```
mongod --dbpath=/Users/tuxiuluo/data/db
```

2. 启动项目

```
yarn dev
```

3. 查看 graphql 接口面板

```
http://localhost:3001/graphql
```

![20200521233005](http://qiniu.luotuxiu.cn/img/20200521233005.png)

## 更新日志

### 2020.05.24

V0.1 版本

1. 实现 nodejs + mongoodb + apollo + graphql run 起来
2. 与前台实现简单登录、注册 demo 接口

###

V0.1 版本

### todo

1. 封装异常处理
2. mongoose 封装
3. token 过期处理
4. 存储页面数据处理
5. 加签名处理
6. 自动化部署
