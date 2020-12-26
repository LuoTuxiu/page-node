import DbHelper from '../utils/dbHelper';

interface QueryPageType {
  page: number;
  limit: number;
}

interface QueryPageDetailType {
  pageId: string // 博客id
}

interface AddPageType {
  category_id: string; // 分组
  content: string;
  title: string,
}

interface UpdatePageType extends AddPageType {
  pageId: string; // 博客id
  juejin_id?: '',
  jianshu_id?: ''
}

const crypto = require('crypto');

const mogoose = DbHelper.connect();

const pageSechema = new mogoose.Schema({
  url: String,
  content: {
    // required: true,
    type: String
  },
  endTime: Number,
  updateTime: Number,
  createTime: Number,
  title: {
    required: true,
    type: String
  },
  description: String,
  keyword: String,
  category: {
    required: true,
    type: 'ObjectId',
    ref: 'categorys'
  },
  pageId: String, // 博客id
  originPath: String, // 原始路径
  juejin_id: String, // 掘金对应的id
  juejin_updateTime: Number,
  jianshu_id: String, // 简书对应的id
  jianshu_updateTime: Number
  // _id: String
});

const PageCol = mogoose.model('pages', pageSechema);

const PageModel = {
  async query(params: QueryPageType): Promise<any> {
    const { page = 1, limit = 10, ...args } = params;
    const offset = (page - 1 >= 0 ? page - 1 : 0) * limit;
    const list = ((await PageCol.find(args, null, { sort: { updateTime: -1 } }).populate('category')
      .skip(offset)
      .limit(limit)) as unknown) as Page.Item[];
    return {
      total: PageCol.estimatedDocumentCount(),
      list
    };
  },
  async queryOne(params: QueryPageDetailType): Promise<any> {
    const { pageId } = params;
    const result = await PageCol.findOne({ pageId }).populate('category');
    return result;
  },
  async addPage(params: AddPageType) {
    const {category_id, content, title} = params
    const md5 = crypto.createHash('md5');
    const pageId = md5.update(`${category_id}\\${title}`).digest('hex');
    // todo 这里先不用判断是否最新，先直接插入数据
    // const isNew = !(await PageCol.exists({ pageId }));
    // if (!isNew) {
    //   return Promise.resolve(undefined);
    // }
    console.log(`category_id is ${category_id}`);
    const now = new Date().getTime()
    const newParams = {
      content: decodeURIComponent(content),
      pageId,
      title,
      category: category_id,
      updateTime: now,
      createTime: now
    };
    const result = await PageCol.create(newParams);
    return result;
  },
  async updatePage(params: UpdatePageType): Promise<Page.Item> {
    const { pageId, category_id, ...restParams } = params
    if (!pageId) {
      throw new Error('pageId required')
    }
    const now = new Date().getTime()
    let newData = {...restParams,   category: category_id, updateTime: now}
    if (params.content) {
      newData = {...newData, content: decodeURIComponent(params.content)}
    }
    if (params.juejin_id) { // 发布掘金
      newData = {...newData, juejin_updateTime: now}
    }
    if (params.jianshu_id) { // 发布简书
      newData = {...newData, jianshu_updateTime: now}
    }
    return (PageCol.findOneAndUpdate(
      {pageId},
      newData,
      {
        upsert: true
      },
      (error) => {
        if (error) {
          throw error
        }
      }
    ) as unknown) as Page.Item;
  },
  // 'article_id': result.result,
  // 'pageId': pageId
  // async updateBlog(params: object): Promise<any> {
  //   const result = await PageCol.findOneAndUpdate(
  //     {
  //       pageId: params.pageId
  //     },
  //     {
  //       juejin_id: params.article_id
  //     }
  //   );
  //   return result;
  // },
  async deletePage(params: QueryPageDetailType) {
    // 看是否有掘金博客，如有有，是否需要先删除掘金博客
    const result = await await PageCol.remove(params)
    return result
  },
};

export default PageModel;
