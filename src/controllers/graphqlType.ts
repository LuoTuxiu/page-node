import {
  gql,
} from 'apollo-server-koa';

const typeDefs = gql`
    type Category {
      updateTime: String
      createTime: String
      category_name: String
      category_id: String
      category_name_en: String
      _id: String
    }

    type Page {
      pageId: String
      category: Category
      url: String
      content: String
      endTime: String
      updateTime: String
      createTime: String
      title: String
      description: String
      keyword: String
      originPath: String
      juejin_id: String
      jianshu_id: String
      juejin_updateTime: String
      jianshu_updateTime: String
      own_blog_id: String
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
      cookie_juejin: String
      cookie_jianshu: String
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
      pageList(
        page: Int
        limit: Int
        keyword: String
        category_id: String
      ): Pages
      categoryList(page: Int, limit: Int): Categorys
      categoryAll: Categorys
      pageDetail(pageId: String): Page
      blogList: [Page]
      jianshuList: JianshuPages
      getPageSetting: PageSetting
    }

    input NewPage {
      category_id: String
      content: String
      title: String
    }

    input NewCategory {
      category_name: String
      category_name_en: String
    }

    input EditPageSetting {
      cookie_juejin: String
      cookie_jianshu: String
      own_blog_service_path: String
    }

    type Mutation {
      login(name: String, passwd: String): UserParams
      logout: ApiData
      register(name: String, passwd: String): ApiData
      addPage(input: NewPage): ApiData
      addCategory(input: NewCategory): ApiData
      addCategoryJianshu(input: NewCategory): ApiData
      deleteCategory(category_id: String): ApiData
      updateCategory(
        category_id: String
        category_name: String
        category_name_en: String
      ): ApiData
      updateLocalBlog(pageId: String): ApiData
      addLocalBlog(pageId: String): ApiData
      deleteLocalBlog(pageId: String): ApiData
      publishJuejinBlog(pageId: String, content: String): ApiData
      publishJianshuBlog(pageId: String, content: String): ApiData
      updateJianshuBlog(
        pageId: String
        content: String
        title: String
        jianshu_id: String
      ): ApiData
      deleteJianshuBlog(pageId: String, jianshu_id: String): ApiData
      updateJuejinBlog(pageId: String, juejin_id: String): ApiData
      deleteJuejinBlog(pageId: String, juejin_id: String): ApiData
      updatePage(
        pageId: String
        content: String
        title: String
        category_id: String
      ): ApiData
      addToLocal(category_id: String, content: String): ApiData
      deletePage(pageId: String): ApiData
      updatePageSetting(input: EditPageSetting): ApiData
    }

    schema {
      query: Query
      mutation: Mutation
    }
  `;

	export default typeDefs