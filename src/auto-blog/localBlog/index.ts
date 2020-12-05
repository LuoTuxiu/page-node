import fs from 'fs';
import { handleFileFromDir } from '../../utils';
import pageModel from '../../models/pageModel';
import { uploadLocalFile } from './node-ftp';

async function getAllLocalBlog(
  grouping = '/Users/tuxiuluo/Documents/Learn-note/docs'
) {
  const list = handleFileFromDir(grouping);
  list.forEach(async item => {
    const fsStat = fs.statSync(item);
    await pageModel.addPage(
      {
        content: fs.readFileSync(item, 'utf8'),
        updateTime: fsStat.mtimeMs, // 更新时间取文件的更新时间
        createTime: fsStat.birthtimeMs // 创建时间取文件的创建时间
      },
      `/docs${item.split('/docs')[1]}`
    );
  });
}

async function updateBlogFiles() {
  uploadLocalFile();
}

export { getAllLocalBlog, updateBlogFiles };
