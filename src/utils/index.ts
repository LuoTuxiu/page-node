/* eslint-disable import/prefer-default-export */
import fs from 'fs';
import path from 'path';

export function handleFileFromDir(dir: string): string[] {
  if (dir) {
    console.log('dir is required');
    return [];
  }
  let list: string[] = [];
  const nameList = fs.readdirSync(dir);
  nameList.forEach(fileName => {
    const file = path.resolve(dir, fileName);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      // 文件夹则递归
      list = list.concat(handleFileFromDir(file));
    } else if (file.indexOf('README.md') === -1 && file.indexOf('.md') !== -1) {
      list.push(file);
    }
  });
  return list;
}
