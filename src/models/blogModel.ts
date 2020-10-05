import DbHelper from '../utils/dbHelper';

const crypto = require('crypto');

const mogoose = DbHelper.connect();

const blogSechema = new mogoose.Schema({
  id: String,
  title: String,
  content: String,
  createTime: Number,
  originPath: String,
  updateTime: Number,
  category: [String]
});

const blogCol = mogoose.model('blog', blogSechema);

const BlogModel = {
  async queryList(params?: object): Promise<any> {
    return blogCol
      .find({}, (error, data) => {
        console.log(data);
      })
      .limit(10);
  },
  async addBlog(params: object, filePath): Promise<any> {
    let result;
    const md5 = crypto.createHash('md5');
    const id = md5
      .update(filePath)
      // .update('docs/front/如何禁止谷歌浏览器自动填充密码.md')
      .digest('hex');
    const now = new Date().getTime();
    const blog = new blogCol({
      ...params,
      id,
      createTime: now,
      updateTime: now,
      originPath: filePath,
      title: filePath
        .split('/')
        .reverse()[0]
        .replace('.md', '')
    });
    console.log(`id is ${id}`);
    result = await blog.save(error => {
      error && console.log(error);
    });
    return result;
  }
};

export default BlogModel;
