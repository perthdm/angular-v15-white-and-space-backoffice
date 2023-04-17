export interface Employee {
  _id: string;
  name: string;
  salary: number;
  email?: string;
  telephone?: string;
  dob?: string;
  gender: string;
  isActive: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeePagination {
  items: Employee[];
  total: number;
  page: number;
  last_page: number;
}
