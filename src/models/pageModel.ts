import DbHelper from '../utils/dbHelper';

const mogoose = DbHelper.connect();

const pageSechema = new mogoose.Schema({
  url: String,
  content: String,
  endTime: Number,
  updatedTime: Number,
  createdTime: Number,
  title: String,
  description: String,
  keyword: String
  // _id: String
});

const PageCol = mogoose.model('page', pageSechema);

const PageModel = {
  async query(params: object): Promise<any> {
    console.log(params);
    console.log('进入model层了');
    return PageCol.find({}, function(error, docs) {
      console.log(...arguments);
      if (error) {
        console.log(error);
      }
    }).limit(10) as unknown as page.Item[];
  },
  async update(query: object, data: object): Promise<page.Item> {
    console.log(...arguments);
    return (PageCol.findOneAndUpdate(
      query,
      data,
      {
        upsert: true
      },
      function(error) {
        if (error) {
          console.log(error);
        }
      }
    ) as unknown) as page.Item;
  },
  async add(params: object): Promise<page.Item> {
    let result: page.Item;
    const page = new PageCol(params);
    result = await page.save(function(error) {
      if (error) {
        console.log(error);
      }
    });
    console.log(result);
    return result;
  }
};

export default PageModel;
