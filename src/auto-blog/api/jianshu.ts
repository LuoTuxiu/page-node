import request from '@/utils/request';

const URL_JIANSHU = 'https://www.jianshu.com';

const judgeApi = data => {
  return new Promise((resolve) => {
    if (!data.data) {
      resolve([data.response.data.error[0], null]);
    } else {
      resolve([null, data.data]);
    }
  });
};

// 获取博客分类
export const getJianshuCategoryApi = async () => {
	const url = '/author/notebooks';
	const data = await request({
		url,
		baseURL: URL_JIANSHU,
	});
	return judgeApi(data);
};

// 新建博客草稿
export const postJianshuCreateDraftApi = async (params = {}) => {
	const url = '/author/notes';
	const {data} = params
  const result = await request({
    url,
    baseURL: URL_JIANSHU,
    method: 'POST',
    data
  });
  return judgeApi(result);
};

// 更新博客草稿
export const postJianshuUpdateDraftApi = async (params = {}) => {
  const url = `/author/notes/${params.data.id}`;
  const data = await request({
    url,
    baseURL: URL_JIANSHU,
    method: 'PUT',
    ...params
	});
  return judgeApi(data);
};

// 发布简书文章
export const postJianshuPublishApi = async (params = {}) => {
	try {
		const url = `/author/notes/${params.params.draft_id}/publicize`;
		const data = await request({
			url,
			baseURL: URL_JIANSHU,
			method: 'POST',
			data: {}
		});
		return judgeApi(data);
	} catch (error) {
		return judgeApi(error);
	}
 
};

// 获取简书文章列表
export const getJianshuArticleListApi = async (params = {
}) => {
  const url = `/author/notebooks/${params.notebook_id}/notes`;
  const data = await request({
    url,
    baseURL: URL_JIANSHU,
	});
  return judgeApi(data)
};

// 删除简书文章
export const deleteJianshuArticleApi = async (params = {
}) => {
  const url = `author/notes/${params.blogId}/soft_destroy`;
  const data = await request({
    url,
    baseURL: URL_JIANSHU,
    method: 'POST',
  });
  return judgeApi(data)
};
