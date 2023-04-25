import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_DOMAIN } from 'src/utils/utils';
import { IStockPagination } from '../model/stock.model';

// import { map } from 'rxjs/operators';

interface Pagination {
  page: number;
  limit: number;
  type: string;
  query?: string;
}

const ENDPOINT = {
  GET_ALL: ({ page, limit, type, query }: Pagination) =>
    `${API_DOMAIN}/stock?page=${page}&limit=${limit}&type=${type}&query=${query}`,
  UPDATE: `${API_DOMAIN}/stock`,
};

@Injectable()
export class StockService {
  constructor(private readonly http: HttpClient) {}

  getAllStock(pageConfig: Pagination): Observable<IStockPagination> {
    return this.http.get<IStockPagination>(ENDPOINT.GET_ALL(pageConfig), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  updateStock(data: any): Observable<any> {
    return this.http.post<any>(ENDPOINT.UPDATE, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }
}
