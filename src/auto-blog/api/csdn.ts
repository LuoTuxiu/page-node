import request from '../../utils/request';

const URL_CSDN = 'https://bizapi.csdn.net/blog-console-api/v1';

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
export const getCsdnTagsApi = async () => {
  const url = '/tag_api/v1/query_tag_list';
  const data = await request({
    url,
    baseURL: URL_CSDN,
    method: 'POST'
  });
  return judgeApi(data);
};

// 获取博客分类
export const getCsdnCategoryApi = async () => {
  const url = '/tag_api/v1/query_category_list';
  const data = await request({
    url,
    baseURL: URL_CSDN,
    method: 'POST'
  });
  return judgeApi(data);
};

// 新建博客草稿
export const postCsdnCreateDraftApi = async (params = {}) => {
  const url = '/content_api/v1/article_draft/create';
  const data = await request({
    url,
    baseURL: URL_CSDN,
    method: 'POST',
    ...params
  });
  return judgeApi(data);
};

// 更新博客草稿
export const postCsdnUpdateDraftApi = async (params = {}) => {
  const url = '/content_api/v1/article_draft/update';
  const data = await request({
    url,
    baseURL: URL_CSDN,
    method: 'POST',
    ...params
  });
  return judgeApi(data);
};

// 发布CSDN文章
export const postCsdnPublishApi = async (params = {}) => {
  const url = '/content_api/v1/article/publish';
  const data = await request({
    url,
    baseURL: URL_CSDN,
    method: 'POST',
    ...params
  });
  return judgeApi(data);
};

// 获取CSDN文章列表
export const getCsdnArticleListApi = async (params = {
}) => {
  const url = '/article/list?pageSize=20';
  const data = await request({
    url,
    baseURL: URL_CSDN,
		method: 'POST',
		headers: {
			'x-ca-signature': 'kuzvLCBvw8O7WQPXFu2P1EKiL1qfuJrHV1ggPc59JRE=',
			'x-ca-nonce': 'fff7a39b-9c55-4452-91ea-4af2bc61b86a'
		},
    ...params
  });
  return judgeApi(data)
};
