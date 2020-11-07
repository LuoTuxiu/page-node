declare namespace user {
  interface Info {
    _id: string;
    name: string;
    passwd: string;
    createTime: number;
    roles: [string]
  }
}
