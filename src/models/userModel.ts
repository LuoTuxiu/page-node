import DbHelper from '../utils/dbHelper';

const mongoose = DbHelper.connect();

const UserSechema = new mongoose.Schema({
  name: String,
  passwd: String
  // createTime: {
  //   type: Number,
  //   default: Date.now()
  // }
});

const UserCol = mongoose.model('user', UserSechema);

const UserModel = {
  async add(params: any): Promise<boolean | user.Info> {
    console.log(params);
    const {name, passwd } = params
    if (name === '' || passwd === '') {
      return false
    }
    let result: boolean | user.Info;
    const findObj = await this.query(params);
    console.log(findObj);
    if (findObj.length > 0) {
      console.log('该用户已存在')
      // 数据库已有该数据，无需注册
      result = false;
    } else {
      const people = new UserCol(params);
      console.log('进到保存了');
      result = await people.save();
    }
    console.log(result);
    return result;
  },
  async query(params: object): Promise<user.Info[]> {
    console.log(params);
    console.log('进到query');
    return (UserCol.find(params, error => {
      if (error) {
        console.log('some error happen');
        console.warn(error);
      }
    }) as unknown) as user.Info[];
  }
};
export default UserModel;
