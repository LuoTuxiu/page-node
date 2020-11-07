import request from '../../utils/request';

const URL_JUEJIN = 'https://apinew.juejin.im';

const judgeApi = data => {
  return new Promise((resolve, reject) => {
    if (!data.data.data) {
      resolve([data.data, null]);
    } else {
      resolve([null, data.data.data]);
    }
  });
};

// 获取博客tag
export const getJuejinTagsApi = async () => {
  const url = '/tag_api/v1/query_tag_list';
  const data = await request({
    url,
    baseURL: URL_JUEJIN,
    method: 'POST'
  });
  return judgeApi(data);
};

// 获取博客分类
export const getJuejinCategoryApi = async () => {
  const url = '/tag_api/v1/query_category_list';
  const data = await request({
    url,
    baseURL: URL_JUEJIN,
    method: 'POST'
  });
  return judgeApi(data);
};

// 新建博客草稿
export const postJuejinCreateDraftApi = async (params = {}) => {
  const url = '/content_api/v1/article_draft/create';
  const data = await request({
    url,
    baseURL: URL_JUEJIN,
    method: 'POST',
    ...params
  });
  return judgeApi(data);
};

// 更新博客草稿
export const postJuejinUpdateDraftApi = async (params = {}) => {
  const url = '/content_api/v1/article_draft/update';
  const data = await request({
    url,
    baseURL: URL_JUEJIN,
    method: 'POST',
    ...params
  });
  return judgeApi(data);
};

// 发布掘金文章
export const postJuejinPublishApi = async (params = {}) => {
  const url = '/content_api/v1/article/publish';
  const data = await request({
    url,
    baseURL: URL_JUEJIN,
    method: 'POST',
    ...params
  });
  return judgeApi(data);
};

// 获取掘金文章列表
export const getJuejinArticleListApi = async (params = {
}) => {
  const url = '/content_api/v1/article/query_list';
  const data = await request({
    url,
    baseURL: URL_JUEJIN,
    method: 'POST',
    ...params
  });
  return judgeApi(data)
};

// 删除掘金文章
export const deleteJuejinArticleApi = async (params = {
}) => {
  const url = '/content_api/v1/article/delete';
  const data = await request({
    url,
    baseURL: URL_JUEJIN,
    method: 'POST',
    ...params
  });
  return judgeApi(data)
};
