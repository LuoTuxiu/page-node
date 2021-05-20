import PageModel from '../../models/pageModel';
import {
  getJianshuTagsApi,
  postJianshuUpdateDraftApi,
  postJianshuPublishApi,
  getJianshuCategoryApi,
  postJianshuCreateDraftApi,
  getJianshuArticleListApi,
  deleteJianshuArticleApi
} from '../api/jianshu';

// 获取分类
const getJianshuCategory = async () => {
  const [err, data] = await getJianshuCategoryApi();
  if (err) {
    console.log('getJianshuCategory error');
    console.log(err);
    return;
  }
  return [err, data];
};

// 新建简书博客
const postJianshuCreateDraft = async originParams => {
  const params = {
    data: {
      notebook_id: originParams.category_id_jianshu,
      title: originParams.title,
      at_bottom: true
    }
  };
  const [err, data] = await postJianshuCreateDraftApi(params);
  if (err) {
    console.log('新建简书博客报错');
    console.log(err);
    throw err;
  }
  return [err, data];
};

const getJianshuTags = async () => {
  try {
    const data = await getJianshuTagsApi();
    console.log(`-----------`);
  } catch (err) {
    console.log(`xxxxxxxxxxx`);
    // console.log(err);
  }
};

// 更新草稿
const postUpdateJianshuDraft = async ({ id, category_id, pageId } = {}) => {
  if (!id || !category_id) {
    console.warn(`check postUpdateJianshuDraft`);
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
  const [err, data] = await postJianshuUpdateDraftApi(params);
  if (err) {
    console.log('postUpdateJianshuDraft error');
    console.log(err);
    throw err;
  }
  return Promise.resolve([err, data]);
};

// 自动更新草稿
const postAutoUpdateJianshuDraft = async ({ id, title, content } = {}) => {
  if (!id) {
    console.warn(`check postUpdateJianshuDraft`);
    return;
  }
  const params = {
    data: {
      autosave_control: 2,
      id,
      title,
      content
    }
  };
  const [err, data] = await postJianshuUpdateDraftApi(params);
  if (err) {
    console.log('postAutoUpdateJianshuDraft error');
    console.log(err);
    throw err;
  }
  return Promise.resolve([err, data]);
};

// 发布
const postJianshuPublish = async ({ id }) => {
  const params = {
    params: { draft_id: id }
  };
  const result = await postJianshuPublishApi(params);
  return result;
};

// 获取文章列表
const getJianshuArticleList = async () => {
  const params = {
    notebook_id: '48973545'
    // data: { user_id: '2752832846174765', sort_type: 2, cursor: '0' }
  };
  const [err, data] = await getJianshuArticleListApi(params);
  if (err) {
    console.log('getJianshuArticleList error');
    console.log(err);
    throw err;
  }
  console.log('获取文章列表成功');
  // console.log(data);
  return { list: data };
  // data.forEach(async item => {
  //   await jianshuModel.syncJianshuToLocal(item.article_info)
  // })
  // console.log(data);
};

// 删除简书博客
const deleteJianshuBlog = async ({ pageId, jianshu_id }) => {
  const [err, result] = await deleteJianshuArticleApi({
    blogId: jianshu_id
  });
  console.log('====================================');
  console.log(err);
  console.log(result);
  console.log('====================================');
  if (!err || err.error === 'Record not found' || err.err_no === 0) {
    // err_no = 0 代表成功
    console.log(`删除简书在该行的记录`);
    await PageModel.update({
      jianshu_id: '',
      pageId
    });
    return;
    // await jianshuModel.deleteLocalJianshu({ jianshu_id });
  }
  console.warn('deleteJianshuBlog error');
  console.log(err);
  console.log(result);
  return [err];
};

// 新建一篇简书博客
const jianshuAddBlog = async ({ pageId }) => {
  const { title, content, jianshu_id } = await PageModel.queryOne({
    // 从本地读取博客信息
    pageId
  });
  let id = jianshu_id;
  if (!jianshu_id) {
    const [, categoryData] = await getJianshuCategory();
    const { id: category_id_jianshu } = categoryData.find(
      item => item.name === '前端' // todo 写死“前端”
    );
    console.log(`获取文章分类成功: ${category_id_jianshu}`);
    const [, createData] = await postJianshuCreateDraft({
      category_id_jianshu,
      title
    });
    id = createData.id; // id为新建博客的id
  }
  console.log(`成功新建博客，id是${id}`);
  const params = {
    data: { id, autosave_control: 1, title, content }
  };
  await postJianshuUpdateDraftApi(params);
  console.log(`成功更新博客id为${id}的草稿`);
  const [err, result] = await postJianshuPublish({
    id
  });
  if (!err) {
    await getJianshuArticleList();
    console.log('发布成功了');
    return [
      null,
      {
        jianshu_id: id,
        pageId
      }
    ];
  }
  console.log(`失败更新博客${id}，原因是简书端报错: ${err.message}`);
  return [err];
};

/**
 * 更新单个简书博客
 * @param param0
 */
const updateJianshu = async ({ pageId, jianshu_id, content, title }) => {
  // const [, categoryData] = await getJianshuCategory();
  // const { category_id } = categoryData.find(
  //   item => item.category.category_name === '前端'
  // );
  await getJianshuArticleList();
  // const {draft_id, category_id} = await JianshuModel.queryOne({
  //   jianshu_id
  // })
  await postAutoUpdateJianshuDraft({
    id: jianshu_id,
    content: decodeURIComponent(content),
    title
    // content
  });
  const [err, result] = await postJianshuPublish({
    id: jianshu_id
  });
  if (!err) {
    // await jianshuModel.syncJianshuToLocal({ ...result, pageId });
    return {
      article_id: result.article_id,
      pageId
    };
  }
  // await getJianshuArticleList()
};

export {
  getJianshuCategory,
  postJianshuCreateDraft,
  getJianshuTags,
  postUpdateJianshuDraft,
  postJianshuPublish,
  jianshuAddBlog,
  deleteJianshuBlog,
  updateJianshu,
  getJianshuArticleList
};
