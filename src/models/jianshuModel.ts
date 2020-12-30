import DbHelper from '@/utils/dbHelper';

const mogoose = DbHelper.connect();

interface QueryPageType {
  page: number;
  limit: number;
}

const jianshuSechema = new mogoose.Schema({
	autosave_control: Number,
	content_updated_at: Number,
	id: Number,
	in_book: Boolean,
	is_top: Boolean,
	last_compiled_at: Number,
	note_type: Number,
	notebook_id: Number,
	paid: Boolean,
	reprintable: Boolean,
	schedule_publish_at: Object,
	seq_in_nb: Number,
	shared: Boolean,
	slug: String,
	title: String,
});

const jianshuCol = mogoose.model('jianshu', jianshuSechema);

const JianshuModel = {
  async syncJianshuToLocal(params: object = {}) {
    const result = await jianshuCol.updateOne(
      {
        article_id: params.article_id
      },
      params,
      {
        upsert: true
      }
    );
    console.log(`params.article_id is ${params.article_id}`);
    return result;
  },
  async deleteLocalJianshu(params = {}) {
    const { jianshu_id } = params;
    // await jianshuCol.deleteOne({ id });
    console.log(`deleteLocalJianshu ${params.id} success`);
  },
  async queryOne(params: object): Promise<any> {
    const { jianshu_id } = params;
    const result = await jianshuCol.findOne({ article_id:jianshu_id  });
    return result;
  },
};

export default JianshuModel;
