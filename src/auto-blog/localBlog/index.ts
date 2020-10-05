import {handleFileFromDir} from '../../utils'
import blogModel from '../../models/blogModel'

const fs  = require('fs')

async function listFiles(filePath = '/Users/tuxiuluo/Documents/Learn-note/docs') {
	const list = handleFileFromDir(filePath)
	list.forEach(async item => {
		await blogModel.addBlog({
			content: fs.readFileSync(
        item,
        'utf8'
      )
		}, `/docs${item.split('/docs')[1]}`,)
	})
}

export {
	listFiles
}