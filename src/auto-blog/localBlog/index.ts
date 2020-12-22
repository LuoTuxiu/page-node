import fs from 'fs';
import { handleFileFromDir } from '../../utils';
import pageModel from '../../models/pageModel';
import { uploadLocalFile } from './node-ftp';

async function getAllLocalBlog(
  category_id = '/Users/tuxiuluo/Documents/Learn-note/docs'
) {
  const list = handleFileFromDir(category_id);
  list.forEach(async item => {
    const fsStat = fs.statSync(item);
    const titleList = item.replace('.md', '').split('/')
    const content = fs.readFileSync(item, 'utf8')
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

async function updateBlogFiles() {
  uploadLocalFile();
}

export { getAllLocalBlog, updateBlogFiles };
