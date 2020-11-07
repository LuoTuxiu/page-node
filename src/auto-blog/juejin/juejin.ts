import PageModel from '../../models/pageModel';
import {
  getJuejinTagsApi,
  postJuejinUpdateDraftApi,
  postJuejinPublishApi,
  getJuejinCategoryApi,
  postJuejinCreateDraftApi,
  getJuejinArticleListApi,
  deleteJuejinArticleApi
} from '../api/juejin';
import juejinModel from '../../models/juejinModel'

// 获取分类
const getJuejinCategory = async () => {
  const params = {
    data: {}
  };
  const [err, data] = await getJuejinCategoryApi(params);
  if (err) {
    console.log('postJuejinDraft error');
    console.log(err);
    return;
  }
  console.log('成功获取category');
  return Promise.resolve([err, data]);
};

// 创建草稿
const postJuejinCreateDraft = async (originParams) => {
  const params = {
    data: {
      category_id: originParams.category_id,
      tag_ids: [],
      link_url: '',
      cover_image: '',
      title: '',
      brief_content: '',
      edit_type: 10,
      html_content: 'deprecated',
      mark_content: ''
    }
  };
  const [err, data] = await postJuejinCreateDraftApi(params);
  if (err) {
    console.log('postJuejinDraft error');
    console.log(err);
    return;
  }
  console.log('成功新建草稿');
  return Promise.resolve([err, data]);
};

const getJuejinTags = async () => {
  try {
    const data = await getJuejinTagsApi();
    console.log(`-----------`);
  } catch (err) {
    console.log(`xxxxxxxxxxx`);
    // console.log(err);
  }
};

// 更新草稿
const postJuejinDraft = async ({ id, category_id, origin_blog_id } = {}) => {
  if (!id || !category_id) {
    console.warn(`check postJuejinDraft`);
    return;
  }
  const {content, title} = await PageModel.queryOne({ // 从本地读取博客信息
    id: origin_blog_id
  })
  console.log(`开始打印读取的数据库信息`)
  console.log(content);
  console.log(title);
  const params = {
    data: {
      id,
      category_id,
      tag_ids: ['6809640357354012685'],
      link_url: '',
      cover_image: '',
      title,
      brief_content: '',
      edit_type: 10,
      html_content: 'deprecated',
      mark_content: content
    }
  };
  const [err, data] = await postJuejinUpdateDraftApi(params);
  if (err) {
    console.log('postJuejinDraft error');
    console.log(err);
    return;
  }
  console.log('成功更新草稿');
  return Promise.resolve([err, data]);
};

// 发布
const postJuejinPublish = async ({ id }) => {
  const params = {
    data: { draft_id: id }
  };
  const [err, data] = await postJuejinPublishApi(params);
  if (err) {
    console.log('postJuejinPublish error');
    console.log(err);
    return;
  }
  return [err, data]
};

// 获取文章列表
const getJuejinArticleList = async () => {
  const params = {
    data: { user_id: '2752832846174765', sort_type: 2, cursor: '0' }
  };
  const [err, data] = await getJuejinArticleListApi(params);
  if (err) {
    console.log('getJuejinArticleList error');
    console.log(err);
    return;
  }
  // data.forEach(async item => {
  //   await juejinModel.syncJuejinToLocal(item.article_info)
  // })
  console.log('获取文章列表成功');
  // console.log(data);
};

// 删除掘金博客
const deleteJuejinBlog = async ({id, juejin_id}) => {
  console.log(`即将要删除博客${juejin_id}`);
  const [err, result] = await deleteJuejinArticleApi({
    data: {'article_id': juejin_id}
  })
  if (!err) {
    await juejinModel.deleteLocalJuejin({juejin_id})
    return [, result]
  }  
    if (err.err_no === 404) {
      console.log(`删除掘金在该行的记录`);
      await PageModel.updateBlog({
        juejin_id: '',
        origin_blog_id: id
      })
    }
    return [err]
};

const juejinAddBlog = async ({id}) => {
  const [, categoryData] = await getJuejinCategory();
  const { category_id } = categoryData.find(
    item => item.category.category_name === '前端'
  );
  const [, createData] = await postJuejinCreateDraft({
    category_id
  });
  await postJuejinDraft({
    category_id,
    id: createData.id,
    'origin_blog_id': id
  }, );
  const [err, result] = await postJuejinPublish({
    id: createData.id
  });
  console.log(`打印发布后的结果`);
  console.log(err);
  console.log(result);
  
  if (!err) {
    await juejinModel.syncJuejinToLocal({...result, 
      'origin_blog_id': id
    })
    return {
      'article_id': result.article_id,
      'origin_blog_id': id
    }
  }
  // await getJuejinArticleList()
};
export {
  getJuejinCategory,
  postJuejinCreateDraft,
  getJuejinTags,
  postJuejinDraft,
  postJuejinPublish,
  juejinAddBlog,
  deleteJuejinBlog
};
