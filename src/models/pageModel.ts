import DbHelper from '../utils/dbHelper';

const crypto = require('crypto');

const mogoose = DbHelper.connect();

const pageSechema = new mogoose.Schema({
  url: String,
  content: String,
  endTime: Number,
  updateTime: Number,
  createTime: Number,
  title: String,
  description: String,
  keyword: String,
  id: String,
  originPath: String,
  category: [String],
  "juejin_id": String
  // _id: String
});

const PageCol = mogoose.model('blogs', pageSechema);

const PageModel = {
  async query(params: object): Promise<any> {
    console.log(params);
    const {page = 1, limit = 10, ...args} = params
    const offset = (page - 1 >= 0 ? page - 1 : 0) * limit
    console.log('进入查询本地博客model层了');
    const list = await PageCol.find(args).skip(offset).limit(limit) as unknown as page.Item[]
    return {
      total: PageCol.estimatedDocumentCount(),
      list
    };
  },
  async queryOne(params: object): Promise<any> {
    console.log(params);
    const {page = 1, limit = 10, ...args} = params
    const offset = (page - 1 >= 0 ? page - 1 : 0) * limit
    console.log('进入查询本地博客model层了');
    const list = await PageCol.find(args).skip(offset).limit(limit) as unknown as page.Item[]
    console.log(list)
    return list && list[0]
    ;
  },
  async update(query: object, data: object): Promise<page.Item> {
    console.log(...arguments);
    return (PageCol.findOneAndUpdate(
      query,
      data,
      {
        upsert: true
      },
      function(error) {
        if (error) {
          console.log(error);
        }
      }
    ) as unknown) as page.Item;
  },
  async add(params: object): Promise<page.Item> {
    let result: page.Item;
    const page = new PageCol(params);
    result = await page.save(function(error) {
      if (error) {
        console.log(error);
      }
    });
    console.log(result);
    return result;
  },
  async addBlog(params: object, filePath): Promise<any> {
    let result;
    const md5 = crypto.createHash('md5');
    const id = md5
      .update(filePath)
      // .update('docs/front/如何禁止谷歌浏览器自动填充密码.md')
      .digest('hex');
    const now = new Date().getTime();
    const newParams = {
      ...params,
      id,
      createTime: `${now}`,
      updateTime: `${now}`,
      originPath: filePath,
      title: filePath
        .split('/')
        .reverse()[0]
        .replace('.md', '')
    };
    console.log(`id is ${id}`);
    result = await PageCol.updateOne({id}, newParams, {
      upsert: true
    })
    return result;
  },
  // 'article_id': result.result,
  // 'origin_blog_id': id
  async updateBlog(params: object): Promise<any> {
    console.log(`要写入本地博客了`)
    console.log(params);
    const result = await PageCol.findOneAndUpdate({
      id: params.origin_blog_id
    }, {
      juejin_id: params.article_id
    });
    console.log('更新本地blog数据库结果')
    console.log(result);
    return result;
  }
};

export default PageModel;
