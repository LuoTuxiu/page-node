import { gql } from 'apollo-server-koa';

const typeDefs = gql`
  "分类"
  type Category {
    "分类更新时间"
    updateTime: String
    "分类创建时间"
    createTime: String
    "分类名称"
    category_name: String
    "分类id"
    category_id: String
    "分类名称-英文（自建站的url路径需要匹配英文）"
    category_name_en: String
    _id: String
  }

  """
  **文章**
  """
  type Page {
    "pageId，标记page的id"
    pageId: String
    "分类"
    category: Category
    "映射到实际文件夹的路径"
    url: String
    "md内容"
    content: String
    endTime: String
    "更新时间"
    updateTime: String
    "创建时间"
    createTime: String
    "文章标题"
    title: String
    "文章备注"
    description: String
    "文章关键字"
    keyword: String
    originPath: String
    "掘金对应的id"
    juejin_id: String
    "简书对应的id"
    jianshu_id: String
    "最后一次掘金更新时间"
    juejin_updateTime: String
    "最后一次简书更新时间"
    jianshu_updateTime: String
    "自建站的id"
    own_blog_id: String
    "自建站的更新时间"
    own_blog_updateTime: String
  }

  type JianshuPage {
    autosave_control: Int
    content_updated_at: Int
    id: Int
    in_book: Boolean
    is_top: Boolean
    last_compiled_at: Int
    note_type: Int
    notebook_id: Int
    paid: Boolean
    reprintable: Boolean
    schedule_publish_at: String
    seq_in_nb: Int
    shared: Boolean
    slug: String
    title: String
  }

  type Pages {
    total: Int
    list: [Page]
  }

  type PageSetting {
    "掘金cookie"
    cookie_juejin: String
    "简书cookie"
    cookie_jianshu: String
    "自建站nginx对应的服务器文件夹地址"
    own_blog_service_path: String
  }

  type JianshuPages {
    list: [JianshuPage]
  }

  type Categorys {
    total: Int
    list: [Category]
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
    "第几页"
    page: String
    "每页页数"
    limit: String
  }

  type ApiData {
    "接口状态码"
    code: Int
    "接口data"
    data: String
    "出错时的错误提示语"
    msg: String
  }

  input NewPage {
    "分类id"
    category_id: String
    "文章内容"
    content: String
    "文章标题"
    title: String
  }

  input NewCategory {
    "文章分类名称"
    category_name: String
    "文章分类英文名称，作为路径用"
    category_name_en: String
  }

  input EditPageSetting {
    cookie_juejin: String
    cookie_jianshu: String
    own_blog_service_path: String
  }

  type Query {
    userInfo: User
    "列表-查询-文章"
    pageList(
      "第n页，必传"
      page: Int
      "每页限制，必传"
      limit: Int
      "关键字，选传"
      keyword: String
      "分类id，可以传空"
      category_id: String
    ): Pages
    categoryList(
      "第n页，必传"
      page: Int
      "每页限制，必传"
      limit: Int
    ): Categorys
    "查询所有分类"
    categoryAll: Categorys
    "查询文章详情"
    pageDetail(pageId: String): Page
    blogList: [Page]
    jianshuList: JianshuPages
    "获取系统配置-文章配置"
    getPageSetting: PageSetting
  }

  type Mutation {
    login(name: String, passwd: String): UserParams
    logout: ApiData
    register(name: String, passwd: String): ApiData
    "添加文章"
    addPage(input: NewPage): ApiData
    "添加文章分类"
    addCategory(input: NewCategory): ApiData
    "添加简书分类"
    addCategoryJianshu(input: NewCategory): ApiData
    "删除文章分类"
    deleteCategory(category_id: String): ApiData
    "更新文章分类"
    updateCategory(
      category_id: String
      category_name: String
      category_name_en: String
    ): ApiData
    "更新自建站单个博客文章"
    updateLocalBlog(pageId: String): ApiData
    "新增自建站单个博客文章"
    addLocalBlog(pageId: String): ApiData
    "删除自建站单个博客文章"
    deleteLocalBlog(pageId: String): ApiData
    "发布掘金博客"
    publishJuejinBlog(pageId: String, content: String): ApiData
    "发布简书博客"
    publishJianshuBlog(pageId: String, content: String): ApiData
    "更新简书博客-单个博客文章"
    updateJianshuBlog(
      pageId: String
      content: String
      title: String
      jianshu_id: String
    ): ApiData
    "删除简书博客-单个博客文章"
    deleteJianshuBlog(pageId: String, jianshu_id: String): ApiData
    "更新掘金博客-单个文章"
    updateJuejinBlog(pageId: String, juejin_id: String): ApiData
    "删除掘金博客-单个文章"
    deleteJuejinBlog(pageId: String, juejin_id: String): ApiData
    "更新文章-单个文章"
    updatePage(
      pageId: String
      content: String
      title: String
      category_id: String
    ): ApiData
    "删除文章-单个文章"
    deletePage(pageId: String): ApiData
    "更新文章"
    updatePageSetting(input: EditPageSetting): ApiData
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

export default typeDefs;
