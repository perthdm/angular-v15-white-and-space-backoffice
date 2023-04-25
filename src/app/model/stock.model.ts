import { IAddOn } from './addon.model';

export interface IStock {
  _id: string;
  name: string;
  description?: string;
  category: object;
  price: number;
  status?: boolean;
  add_on?: IAddOn[];
  user_created?: object;
  user_updated?: object;
  createdAt?: string;
  updatedAt?: string;
}

export interface IStockPagination {
  items: IStock[];
  total: number;
  page: number;
  last_page: number;
}
