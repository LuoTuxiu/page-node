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
  blogId: String, // 博客id
  originPath: String, // 原始路径
  category: [String],
  juejin_id: String, // 掘金对应的id
  juejin_updateTime: Number
  // _id: String
});

const PageCol = mogoose.model('blogs', pageSechema);

const PageModel = {
  async query(params: object): Promise<any> {
    const { page = 1, limit = 10, ...args } = params;
    const offset = (page - 1 >= 0 ? page - 1 : 0) * limit;
    const list = ((await PageCol.find(args, null, { sort: { updateTime: -1 } })
      .skip(offset)
      .limit(limit)) as unknown) as page.Item[];
    return {
      total: PageCol.estimatedDocumentCount(),
      list
    };
  },
  async queryOne(params: object): Promise<any> {
    const { blogId } = params;
    console.log(blogId);
    const result = await PageCol.findOne({ blogId });
    return result;
  },
  async update(query: object, params: object): Promise<page.Item> {
    const newData = {content: decodeURIComponent(params.content)}
    if (!params.blogId) {
      const now = new Date().getTime()
      newData = { ...newData, createTime: now,
        updateTime: now}
    }
    return (PageCol.findOneAndUpdate(
      query,
      newData,
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
  async addPage(input = {}) {
    const {filePath, content} = input
    const md5 = crypto.createHash('md5');
    const blogId = md5.update(filePath).digest('hex');
    // todo 这里先不用判断是否最新，先直接插入数据
    // const isNew = !(await PageCol.exists({ blogId }));
    // if (!isNew) {
    //   return Promise.resolve(undefined);
    // }
    const newParams = {
      content,
      blogId,
      originPath: filePath,
      title: filePath
        .split('/')
        .reverse()[0]
        .replace('.md', '')
    };
    const result = await PageCol.updateOne({ blogId }, newParams, {
      upsert: true
    });
    return result;
  },
  // 'article_id': result.result,
  // 'blogId': blogId
  async updateBlog(params: object): Promise<any> {
    const result = await PageCol.findOneAndUpdate(
      {
        blogId: params.blogId
      },
      {
        juejin_id: params.article_id
      }
    );
    return result;
  },
  async deletePage(params) {
    console.log(params);
    const result = await await PageCol.remove(params)
    console.log(result);
    return result
  },
  async updatePage(params) {
    console.log('====================================');
    console.log(params);
    console.log('====================================');
    if (params.blogId) {
      await this.update({
        blogId: params.blogId,
      },
      {
        content: decodeURIComponent(params.content)
      })
    } else{
      const now = new Date().getTime()
      this.add({
        content: decodeURIComponent(params.content),
        createTime: now,
        updateTime: now
      })
    }
      return {
        code: 0
      }
  }
};

export default PageModel;
