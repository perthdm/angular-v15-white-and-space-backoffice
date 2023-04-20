export interface User {
  _id: string;
  username: string;
  role: string;
  name: string;
  telephone: string;
  salary: number;
  gender: string;
  dob: Date;
  createdAt: string;
  updatedAt: string;
}

export interface UserPagination {
  items: User[];
  total: number;
  page: number;
  last_page: number;
}
