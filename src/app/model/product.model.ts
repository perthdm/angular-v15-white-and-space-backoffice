import { IAddOn } from './addon.model';

export interface IProduct {
  add_on: any;
  amount: number;
  auto_stock: boolean;
  createdAt: string;
  description: string;
  name: string;
  price: number;
  product_id: string;
  product_type: string;
  status: boolean;
  stock: boolean;
  updatedAt: string;
  user_created: object;
  user_updated: object;
  _id: string;
}

export interface IProductPagination {
  items: IProduct[];
  total: number;
  page: number;
  last_page: number;
  summary: any;
}
