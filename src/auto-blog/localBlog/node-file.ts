import fs from 'fs';

const writeToLocalFile = async (path: string, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, err => {
			console.log(err);
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const deleteLocalFile = async (path:string) => {
	return new Promise((resolve, reject) => {
		fs.rm(path, err => {
			if (err) {
				// reject(err) 
				resolve() // 失败了也要当做成功处理，删除记录即可
			} else {
				resolve()
			}
		})
	})
}

export { writeToLocalFile, deleteLocalFile };
