export interface User {
  _id: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPagination {
  items: User[];
  total: number;
  page: number;
  last_page: number;
}
