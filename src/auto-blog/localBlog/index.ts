import {handleFileFromDir} from '../../utils'
import pageModel from '../../models/pageModel'
import {uploadLocalFile} from './node-ftp'

const fs  = require('fs')

async function listFiles(filePath = '/Users/tuxiuluo/Documents/Learn-note/docs') {
	const list = handleFileFromDir(filePath)
	list.forEach(async item => {
		await pageModel.addBlog({
			content: fs.readFileSync(
        item,
        'utf8'
      )
		}, `/docs${item.split('/docs')[1]}`,)
	})
}

async function updateBlogFiles() {
	uploadLocalFile()
}

export {
	listFiles,
	updateBlogFiles
}