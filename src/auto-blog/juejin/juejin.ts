import {
  getJuejinTagsApi,
  postJuejinUpdateDraftApi,
  postJuejinPublishApi,
  getJuejinCategoryApi,
  postJuejinCreateDraftApi,
  getJuejinArticleListApi
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
const postJuejinCreateDraft = async () => {
  const params = {
    data: {
      category_id: '6809637772874219534',
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
  console.log('88888888888');
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
const postJuejinDraft = async ({ id, category_id } = {}) => {
  if (!id || !category_id) {
    console.warn(`check postJuejinDraft`);
    return;
  }
  const params = {
    data: {
      id,
      category_id,
      tag_ids: ['6809640357354012685'],
      link_url: '',
      cover_image: '',
      title: 'test',
      brief_content: '',
      edit_type: 10,
      html_content: 'deprecated',
      mark_content: require('fs').readFileSync(
        '/Users/tuxiuluo/Documents/Learn-note/docs/front/js/面试官-手写一个深拷贝.md',
        'utf8'
      )
    }
  };
  const [err, data] = await postJuejinUpdateDraftApi(params);
  console.log('88888888888');
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
  console.log('88888888888');
  if (err) {
    console.log('postJuejinPublish error');
    console.log(err);
    return;
  }
  console.log('成功发布');
};

// 获取文章列表
const getJuejinArticleList = async () => {
  const params = {
    data: { user_id: '2752832846174765', sort_type: 2, cursor: '0' }
  };
  const [err, data] = await getJuejinArticleListApi(params);
  if (err) {
    console.log('postJuejinPublish error');
    console.log(err);
    return;
  }
  data.forEach(async item => {
    await juejinModel.syncJuejinToLocal(item.article_info)
  })
  console.log('获取文章列表成功');
  // console.log(data);
};

const juejinAddBlog = async () => {
  const [err, categoryData] = await getJuejinCategory();
  const { category_id } = categoryData.find(
    item => item.category.category_name === '前端'
  );
  const [, createData] = await postJuejinCreateDraft({
    category_id
  });
  const { id } = createData;
  console.log(`草稿id 是 ${id}`);
  await postJuejinDraft({
    category_id,
    id
  });
  // await postJuejinPublish({
  //   id
  // });
  await getJuejinArticleList()
};
export {
  getJuejinCategory,
  postJuejinCreateDraft,
  getJuejinTags,
  postJuejinDraft,
  postJuejinPublish,
  juejinAddBlog
};
