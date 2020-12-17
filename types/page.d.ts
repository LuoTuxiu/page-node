declare namespace Page {
  interface Item {
    _id: string;
    url: string;
    content: string;
    updateTime: number;
    endTime: number;
    createTime: number;
    title: string;
    description: string;
    keyword: string;
  }

  interface CategoryItem {
    _id: string;
    updateTime: number;
    createTime: number;
    category_name: string
  }
}
