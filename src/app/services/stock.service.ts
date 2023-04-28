import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_DOMAIN } from 'src/utils/utils';
import { IStockPagination } from '../model/stock.model';
import { IPagination } from '../model/pagination.model';

// import { map } from 'rxjs/operators';

const ENDPOINT = {
  GET_ALL: ({ page, limit, type, query }: IPagination) =>
    `${API_DOMAIN}/stock?page=${page}&limit=${limit}&query=${query}`,
  ADD: `${API_DOMAIN}/stock`,
  IMPORT_ITEM: `${API_DOMAIN}/lot`,
};

@Injectable()
export class StockService {
  constructor(private readonly http: HttpClient) {}

  getAllStock(pageConfig: IPagination): Observable<IStockPagination> {
    return this.http.get<IStockPagination>(ENDPOINT.GET_ALL(pageConfig), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  addNewStock(data: any): Observable<any> {
    return this.http.post<any>(ENDPOINT.ADD, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  importItem(data: any): Observable<any> {
    return this.http.post<any>(ENDPOINT.IMPORT_ITEM, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }
}
