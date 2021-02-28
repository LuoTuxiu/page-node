import DbHelper from '../utils/dbHelper';

interface UpdatePageSettingType {
  cookie_juejin: string;
  cookie_jianshu: string;
  own_blog_service_path: string;
}

const mogoose = DbHelper.connect();

const pageSechema = new mogoose.Schema({
  cookie_juejin: {
    // required: true,
    type: String
	},
	cookie_jianshu: {
    // required: true,
    type: String
  },
  own_blog_service_path: String,
  updateTime: Number,
  createTime: Number,
});

const PageSettingCol = mogoose.model('pageSetting', pageSechema);

const PageSettingModel = {
  async queryOne(): Promise<any> {
    const result = await PageSettingCol.findOne({})
    return result;
  },
  async updatePageSetting(params: UpdatePageSettingType): Promise<Page.Item> {
    console.log(params);
    return (PageSettingCol.findOneAndUpdate(
      {},
      params,
      {
        upsert: true
      },
      (error) => {
        if (error) {
          throw error
        }
      }
    ) as unknown) as Page.Item;
  },
};

export default PageSettingModel;
