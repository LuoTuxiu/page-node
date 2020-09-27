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

sftp
	.connect({
		...global.CONFIG.ftp,
		readyTimeout: 10000,
		retries: 2,
	})
	.then(async () => {
		// return sftp.list('/home/luo');
		await compress();
		const buffer = fs.readFileSync(localTarUrl);
		console.log(buffer);
		console.log(remote);
		return sftp.put(buffer, remote);
		// let buffers = handleFileFromDir(localUrl);
		// console.log('----------');
		// console.log(_.flatMapDeep(buffers));
		// return Promise.all(
		// 	buffers.map((buffer) => {
		// 		console.log(`${buffer} ${remote}${buffer.split('dist')[1]}`);
		// 		buffer && sftp.put(buffer, `${remote}${buffer.split('dist')[1]}`);
		// 	})
		// );
	})
	.then((data) => {
		console.log('upload success');
		console.log(data);
		require('./node-ssh');
	})
	.catch((err) => {
		console.warn(err);
	});
