import { log } from 'console';
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
import juejinModel from '../../models/juejinModel';
import JuejinModel from '../../models/juejinModel';

// 获取分类
const getJuejinCategory = async () => {
  const params = {
    data: {}
  };
  const [err, data] = await getJuejinCategoryApi(params);
  if (err) {
    console.log('getJuejinCategory error');
    console.log(err);
    return;
  }
  console.log('成功获取category');
  return Promise.resolve([err, data]);
};

// 创建草稿
const postJuejinCreateDraft = async originParams => {
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
    console.log('postJuejinCreateDraft error');
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
const postUpdateJuejinDraft = async ({ id, category_id, pageId } = {}) => {
  if (!id || !category_id) {
    console.warn(`check postUpdateJuejinDraft`);
    return;
  }
  const { title, content } = await PageModel.queryOne({
    // 从本地读取博客信息
    pageId
  });
  console.log(`开始打印读取的数据库信息`);
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
  console.log('====================================');
  console.log(params);
  console.log('====================================');
  const [err, data] = await postJuejinUpdateDraftApi(params);
  if (err) {
    console.log('postUpdateJuejinDraft error');
    console.log(err);
    return;
  }
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
  return [err, data];
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
  data.forEach(async item => {
    await juejinModel.syncJuejinToLocal(item.article_info)
  })
  console.log('获取文章列表成功');
  // console.log(data);
};

// 删除掘金博客
const deleteJuejinBlog = async ({ pageId, juejin_id }) => {
  const [err, result] = await deleteJuejinArticleApi({
    data: { article_id: juejin_id }
  });
  console.log('====================================');
  console.log(err)
  console.log(result)
  console.log('====================================');
  if (!err || err.err_no === 404 || err.err_no === 0) { // err_no = 0 代表成功
    console.log(`删除掘金在该行的记录`);
    await PageModel.updatePage({
      juejin_id: '',
      pageId
    });
    return
    // await juejinModel.deleteLocalJuejin({ juejin_id });
  }
    console.warn('deleteJuejinBlog error')
    console.log(err);
    console.log(result);
    return [err];
  
};

// 新建一篇掘金博客
const juejinAddBlog = async ({ pageId, content }) => {
  const [, categoryData] = await getJuejinCategory();
  const { category_id } = categoryData.find(
    item => item.category.category_name === '前端' // todo 写死“前端”
  );
  const [, createData] = await postJuejinCreateDraft({
    category_id
  });
  await postUpdateJuejinDraft({
    category_id,
    id: createData.id,
    pageId,
    // content
  });
  const [err, result] = await postJuejinPublish({
    id: createData.id
  });
  if (!err) {
    await juejinModel.syncJuejinToLocal({ ...result, pageId });
    return {
      juejin_id: result.article_id,
      pageId
    };
  }
  // await getJuejinArticleList()
};

/**
 * 更新单个掘金博客
 * @param param0
 */
const updateJuejin = async ({ pageId, juejin_id, content }) => {
  // const [, categoryData] = await getJuejinCategory();
  // const { category_id } = categoryData.find(
  //   item => item.category.category_name === '前端'
  // );
  await getJuejinArticleList()
  const {draft_id, category_id} = await JuejinModel.queryOne({
    juejin_id
  })
  await postUpdateJuejinDraft({
    category_id,
    id: draft_id,
    pageId,
    // content
  });
  const [err, result] = await postJuejinPublish({
    id: draft_id
  });
  if (!err) {
    await juejinModel.syncJuejinToLocal({ ...result, pageId });
    return {
      article_id: result.article_id,
      pageId
    };
  }
  // await getJuejinArticleList()
};

export {
  getJuejinCategory,
  postJuejinCreateDraft,
  getJuejinTags,
  postUpdateJuejinDraft,
  postJuejinPublish,
  juejinAddBlog,
  deleteJuejinBlog,
  updateJuejin
};
