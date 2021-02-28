import fs from 'fs';
import {getPageSetting} from '../utils'
import { handleFileFromDir } from '../../utils';
import pageModel from '../../models/pageModel';
import {gitAdd, gitCommit, gitPush, gitCheckBranch, gitPull} from './node-git'
import { uploadLocalFile } from './node-ftp';
import { writeToLocalFile, deleteLocalFile } from './node-file';

const crypto = require('crypto');

async function updateGitStatus({message}) {
  // const currentBranch = 'master'
  const currentBranch = 'test'
  await gitCheckBranch({targetBranch: currentBranch})
  await gitPull({targetBranch: currentBranch})
  await gitAdd()
  await gitCommit({
    message
  })
  await gitPush({targetBranch: currentBranch})
}

async function getAllLocalBlog(
  category_id = '/Users/tuxiuluo/Documents/Learn-note/docs'
) {
  const list = handleFileFromDir(category_id);
  list.forEach(async item => {
    const fsStat = fs.statSync(item);
    const titleList = item.replace('.md', '').split('/');
    const content = fs.readFileSync(item, 'utf8');
    if (content) {
      await pageModel.addPage(
        {
          content,
          title: titleList[titleList.length - 1],
          category_id: '前端',
          updateTime: fsStat.mtimeMs, // 更新时间取文件的更新时间
          createTime: fsStat.birthtimeMs // 创建时间取文件的创建时间
        },
        `/docs${item.split('/docs')[1]}`
      );
    }
  });
}

async function getLocalBlogPath (dir: string, pageId: string) {
  const { own_blog_service_path } = await getPageSetting();
  const md5 = crypto.createHash('md5');
  const own_blog_id = md5.update(`${pageId}`).digest('hex');
  return {
    path: `${own_blog_service_path}/docs/${dir}/${own_blog_id}.md`,
    own_blog_id
  }
}

async function addLocalBlog(params) {
  const {pageId} = params
  const pageDetail = await pageModel.queryOne({
    pageId
  });
  const {category_name_en} = pageDetail.category || {}
  if (!category_name_en) {
    console.warn('必须先选择一个分类'); // 这里要提示出错
    return
  }
  const {path, own_blog_id} = await getLocalBlogPath(pageDetail.category.category_name_en, pageId)
  const result = await writeToLocalFile(
    path,
    pageDetail.content,
  );
  const message = `feat: add blog: ${pageDetail.title}`
  await updateGitStatus({message})
  // if (!err) {
  // await juejinModel.syncJuejinToLocal({ ...result, pageId });
  return {
    own_blog_id,
    pageId
  }
  // }
}

async function updateLocalBlog(params) {
  const {pageId, own_blog_id} = params
  const pageDetail = await pageModel.queryOne({
    pageId
  });
  const {category_name_en} = pageDetail.category || {}
  if (!category_name_en) {
    console.warn('必须先选择一个分类');
    return
  }
  const {path} = await getLocalBlogPath(pageDetail.category.category_name_en, pageId)
  const result = await writeToLocalFile(
    path,
    pageDetail.content,
  );
  const message = `feat: update blog: ${pageDetail.title}`
  await updateGitStatus({message})
  // if (!err) {
  // await juejinModel.syncJuejinToLocal({ ...result, pageId });
  return {
    own_blog_id,
    pageId
  }
  // }
}

async function deleteLocalBlog(params) {
  const {pageId} = params
  const pageDetail = await pageModel.queryOne({
    pageId
  });
  const {path} = await getLocalBlogPath(pageDetail.category.category_name_en, pageId)
  await deleteLocalFile(path)
  const message = `feat: delete blog: ${pageDetail.title}`
  await updateGitStatus({message})
  return {
    own_blog_id: '',
    pageId
  }
}

async function updateBlogFiles() {
  uploadLocalFile();
}

export { getAllLocalBlog, updateBlogFiles, updateLocalBlog, deleteLocalBlog, addLocalBlog };
