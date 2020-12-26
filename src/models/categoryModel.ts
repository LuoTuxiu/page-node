import DbHelper from '../utils/dbHelper';

interface QueryCategoryType {
  page: number;
  limit: number;
}

interface QueryCategoryDetailType {
  category_id: string // 分类id
}

interface AddCategoryType {
  category_name: string; // 分类名称
}

interface AddCategoryJianshuType {
  category_id_jianshu: string;
  category_id: string; // 分类id
}

interface UpdateCategoryType extends AddCategoryType {
  category_id: string; // 分类id
}

interface DeleteCategoryType  {
  category_id: string; // 分类id
}

const crypto = require('crypto');

const mogoose = DbHelper.connect();

const categorySechema = new mogoose.Schema({
  updateTime: Number,
  createTime: Number,
  category_name: {
    type: String,
    require: true,
  },
  category_id_jianshu: String
});

const CategoryCol = mogoose.model('categorys', categorySechema);

const CategoryModel = {
  async query(params: QueryCategoryType): Promise<any> {
    const { page = 1, limit = 10, ...args } = params;
		const offset = (page - 1 >= 0 ? page - 1 : 0) * limit;
		const findList = await CategoryCol.find(args, null, { sort: { updateTime: -1 } }).skip(offset)
		.limit(limit)
    const list = findList.map(item => {
			item.category_id = item._id
			return item
		});
    return {
      total: CategoryCol.estimatedDocumentCount(),
      list
    };
  },
  async queryAll(params: QueryCategoryType): Promise<any> {
    const { ...args } = params;
		const findList = await CategoryCol.find(args, null, { sort: { updateTime: -1 } })
    const list = findList.map(item => {
			item.category_id = item._id
			return item
		});
    return {
      total: CategoryCol.estimatedDocumentCount(),
      list
    };
  },
  async queryOne(params: QueryCategoryDetailType): Promise<any> {
    const { category_id } = params;
    const result = await CategoryCol.findOne({ category_id });
    return result;
  },
  async addCategory(params: AddCategoryType) {
    const { category_name} = params
    // todo 这里先不用判断是否最新，先直接插入数据
    // const isNew = !(await CategoryCol.exists({ category_id }));
    // if (!isNew) {
    //   return Promise.resolve(undefined);
    // }
    const now = new Date().getTime()
    const newParams = {
      category_name,
      updateTime: now,
      createTime: now
    };
    const result = await CategoryCol.create(newParams);
    return result;
  },
  async addCategoryJianshu(params: AddCategoryJianshuType): Promise<Category.Item> {
    const { category_id, ...restParams } = params
    if (!category_id) {
      throw new Error('category_id required')
    }
    const now = new Date().getTime()
    const newData = {...restParams, updateTime: now}
    return (CategoryCol.findOneAndUpdate(
      {_id: category_id},
      newData,
      {
        upsert: true
      },
      (error) => {
        if (error) {
          throw error
        }
      }
    ) as unknown) as Category.Item;
  },
  async updateCategory(params: UpdateCategoryType): Promise<Category.Item> {
    const { category_id, ...restParams } = params
    if (!category_id) {
      throw new Error('category_id required')
    }
    const now = new Date().getTime()
    const newData = {...restParams, updateTime: now}
    return (CategoryCol.findOneAndUpdate(
      {_id: category_id},
      newData,
      {
        upsert: true
      },
      (error) => {
        if (error) {
          throw error
        }
      }
    ) as unknown) as Category.Item;
  },
  // 'article_id': result.result,
  // 'category_id': category_id
  // async updateBlog(params: object): Promise<any> {
  //   const result = await CategoryCol.findOneAndUpdate(
  //     {
  //       category_id: params.category_id
  //     },
  //     {
  //       juejin_id: params.article_id
  //     }
  //   );
  //   return result;
  // },
  async deleteCategory(params: DeleteCategoryType) {
		if (!params.category_id) {
			throw new Error('category_id required')
		}
    const result = await await CategoryCol.remove({
			_id: params.category_id
		})
    return result
  },
};

export default CategoryModel;
