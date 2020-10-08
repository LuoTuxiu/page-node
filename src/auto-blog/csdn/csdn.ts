import {
  getCsdnTagsApi,
  postCsdnUpdateDraftApi,
  postCsdnPublishApi,
  getCsdnCategoryApi,
  postCsdnCreateDraftApi,
  getCsdnArticleListApi
} from '../api/csdn';
import csdnModel from '../../models/csdnModel'

// 获取分类
const getCsdnCategory = async () => {
  const params = {
    data: {}
  };
  const [err, data] = await getCsdnCategoryApi(params);
  if (err) {
    console.log('postCsdnDraft error');
    console.log(err);
    return;
  }
  console.log('成功获取category');
  return Promise.resolve([err, data]);
};

// 创建草稿
const postCsdnCreateDraft = async () => {
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
  const [err, data] = await postCsdnCreateDraftApi(params);
  if (err) {
    console.log('postCsdnDraft error');
    console.log(err);
    return;
  }
  console.log('成功新建草稿');
  return Promise.resolve([err, data]);
};

const getCsdnTags = async () => {
  try {
    const data = await getCsdnTagsApi();
    console.log(`-----------`);
  } catch (err) {
    console.log(`xxxxxxxxxxx`);
    // console.log(err);
  }
};

// 更新草稿
const postCsdnDraft = async ({ id, category_id } = {}) => {
  if (!id || !category_id) {
    console.warn(`check postCsdnDraft`);
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
  const [err, data] = await postCsdnUpdateDraftApi(params);
  console.log('88888888888');
  if (err) {
    console.log('postCsdnDraft error');
    console.log(err);
    return;
  }
  console.log('成功更新草稿');
  return Promise.resolve([err, data]);
};

// 发布
const postCsdnPublish = async ({ id }) => {
  const params = {
    data: { draft_id: id }
  };
  const [err, data] = await postCsdnPublishApi(params);
  console.log('88888888888');
  if (err) {
    console.log('postCsdnPublish error');
    console.log(err);
    return;
  }
  console.log('成功发布');
};

// 获取文章列表
const getCsdnArticleList = async () => {
  const params = {
    data: { user_id: '2752832846174765', sort_type: 2, cursor: '0' }
  };
  const [err, data] = await getCsdnArticleListApi(params);
  if (err) {
    console.log('postCsdnPublish error');
    console.log(err);
    return;
  }
  data.forEach(async item => {
    await csdnModel.syncCsdnToLocal(item.article_info)
  })
  console.log('获取文章列表成功');
  // console.log(data);
};

const juejinAddBlog = async () => {
  // const [err, categoryData] = await getCsdnCategory();
  // const { category_id } = categoryData.find(
  //   item => item.category.category_name === '前端'
  // );
  // const [, createData] = await postCsdnCreateDraft({
  //   category_id
  // });
  // const { id } = createData;
  // console.log(`草稿id 是 ${id}`);
  // await postCsdnDraft({
  //   category_id,
  //   id
  // });
  // await postCsdnPublish({
  //   id
  // });
  await getCsdnArticleList()
};
export {
  getCsdnCategory,
  postCsdnCreateDraft,
  getCsdnTags,
  postCsdnDraft,
  postCsdnPublish,
	juejinAddBlog,
	getCsdnArticleList
};
