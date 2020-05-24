declare namespace user {
  interface Info {
    _id: string;
    name: string;
    passwd: string;
    createdTime: number;
    roles: [string]
  }
}
