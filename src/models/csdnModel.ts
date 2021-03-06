import DbHelper from '../utils/dbHelper';

const mogoose = DbHelper.connect();

const juejinSechema = new mogoose.Schema({
  article_id: String,
  user_id: String,
  category_id: String,
  tag_ids: [Number],
  visible_level: Number,
  link_url: String,
  cover_image: String,
  is_gfw: Number,
  title: String,
  brief_content: String,
  is_english: Number,
  is_original: Number,
  user_index: Number,
  original_type: Number,
  original_author: String,
  content: String,
  ctime: String,
  mtime: String,
  rtime: String,
  draft_id: String,
  view_count: Number,
  collect_count: Number,
  digg_count: Number,
  comment_count: Number,
  hot_index: Number,
  is_hot: Number,
  rank_index: Number,
  status: Number,
  verify_status: Number,
  audit_status: Number,
  mark_content: String
});

const juejinCol = mogoose.model('csdn', juejinSechema);

const JuejinModel = {
  async syncJuejinToLocal(params: object) {
    const juejin = new juejinCol(params);
    const result = await juejin.save(error => {
      error && console.warn(error);
    });
    return result;
  }
};

export default JuejinModel;
