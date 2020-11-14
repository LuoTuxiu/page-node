import DbHelper from '@/utils/dbHelper'

const mogoose = DbHelper.connect()

const juejinSechema = new mogoose.Schema({
	"article_id": String,
	"user_id": String,
	"category_id": String,
	"tag_ids": [Number],
	"visible_level": Number,
	"link_url": String,
	"cover_image": String,
	"is_gfw": Number,
	"title": String,
	"brief_content": String,
	"is_english": Number,
	"is_original": Number,
	"user_index": Number,
	"original_type": Number,
	"original_author": String,
	"content": String,
	"ctime": String,
	"mtime": String,
	"rtime": String,
	"draft_id": String,
	"view_count": Number,
	"collect_count": Number,
	"digg_count": Number,
	"comment_count": Number,
	"hot_index": Number,
	"is_hot": Number,
	"rank_index": Number,
	"status": Number,
	"verify_status": Number,
	"audit_status": Number,
	"mark_content": String,
	"origin_blog_id": String,
})

const juejinCol = mogoose.model('juejin', juejinSechema)

const JuejinModel = {
	async syncJuejinToLocal(params: object = {}) {
		const result = await juejinCol.updateOne({
			article_id: params.article_id
		}, params, {
      upsert: true
    })
		console.log(`params.article_id is ${params.article_id}`);
		return result
	},
	async deleteLocalJuejin(params = {}) {
		const {id} = params
		await juejinCol.deleteOne({id})
		console.log(`deleteLocalJuejin ${params.id} success`);
	}
}

export default JuejinModel