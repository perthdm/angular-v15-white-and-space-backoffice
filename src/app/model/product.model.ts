export interface IProduct {
  _id: string;
  add_on?: any;
  amount: number;
  auto_stock: boolean;
  description?: string;
  name: string;
  price: number;
  product_id: string;
  product_type: string;
  status: boolean;
  stock?: any;
  createdAt: string;
  updatedAt: string;
  user_created: object;
  user_updated: object;
  image?: string;
}

export interface IProductPagination {
  items: IProduct[];
  total: number;
  page: number;
  last_page: number;
  summary: any;
}
