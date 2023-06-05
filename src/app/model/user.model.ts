export interface IUser {
  _id: string;
  username: string;
  role: string;
  name: string;
  telephone: string;
  salary: number;
  gender: string;
  dob: string;
  is_check_in: false;
  status: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserPagination {
  items: IUser[];
  total: number;
  page: number;
  last_page: number;
}
