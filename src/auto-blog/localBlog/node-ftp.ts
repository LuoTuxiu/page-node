const Client = require('ssh2-sftp-client');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const compressing = require('compressing');

const sftp = new Client();

const localUrl = '/Users/tuxiuluo/Documents/Learn-note/docs/.vuepress/dist';
const localTarUrl = '/Users/tuxiuluo/Documents/Learn-note.tgz';
const remote = '/home/luo/Learn-note.tgz';

// console.log(data);

// function handleFileFromDir(dir) {
// 	let list = [];
// 	const nameList = fs.readdirSync(dir);
// 	nameList &&
// 		nameList.forEach((fileName) => {
// 			let file = path.resolve(dir, fileName);
// 			let stat = fs.statSync(file);
// 			if (stat && stat.isDirectory()) {
// 				list = list.concat(handleFileFromDir(file));
// 			} else {
// 				list.push(file);
// 			}
// 		});
// 	return list;
// }
const compress = async () => {
  return await compressing.tgz.compressDir(localUrl, localTarUrl);
};

const putFileToRemote = async () => {
  await compress();
  const buffer = fs.readFileSync(localTarUrl);
  console.log(buffer);
  console.log(remote);
  return sftp.put(buffer, remote);
};

const uploadLocalFile = async () => {
  try {
    await sftp.list(remote);
  } catch (error) {
    await sftp.connect({
      ...global.CONFIG.ftp,
      readyTimeout: 10000,
      retries: 2
    });
  }
  await putFileToRemote();
  await require('./node-ssh');
};

export { uploadLocalFile };
