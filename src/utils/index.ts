/* eslint-disable import/prefer-default-export */
const fs = require('fs')
const path = require('path')

export function transformArray(array: string[][]): cdFang.IhouseData[] {
  const result = array.map(
    (item): cdFang.IhouseData => ({
      _id: item[0],
      area: item[2],
      name: item[3],
      number: Number.parseInt(item[6], 10),
      beginTime: item[8],
      endTime: item[9],
      status: item[11]
    })
  );
  return result;
}

export function handleFileFromDir(dir) {
	let list = [];
	const nameList = fs.readdirSync(dir);
	nameList &&
		nameList.forEach((fileName) => {
			const file = path.resolve(dir, fileName);
			const stat = fs.statSync(file);
			if (stat && stat.isDirectory()) {
				list = list.concat(handleFileFromDir(file));
			} else {
				file.indexOf('README.md') === -1 && file.indexOf('.md') !== -1 && list.push(file);
			}
		});
	return list;
}