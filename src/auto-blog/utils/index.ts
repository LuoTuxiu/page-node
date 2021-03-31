import PageSettingModel from '@/models/pageSettingModel';

async function getPageSetting() {
  const result = await PageSettingModel.queryOne();
  return result;
}

export { getPageSetting };
