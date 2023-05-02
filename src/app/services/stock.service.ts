import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_DOMAIN } from 'src/utils/utils';
import { IStockPagination } from '../model/stock.model';
import { IPagination } from '../model/pagination.model';

// import { map } from 'rxjs/operators';

const ENDPOINT = {
  STOCK: {
    GET_ALL: ({ page, limit, query }: IPagination) =>
      `${API_DOMAIN}/stock?page=${page}&limit=${limit}&query=${query}`,
    ADD: `${API_DOMAIN}/stock`,
    UPDATE: `${API_DOMAIN}/stock`,
    GET_ALL_UNBINDING: `${API_DOMAIN}/stock/un-used`,
  },

  LOT: {
    GET_ALL_TRX: ({ page, limit, type }: IPagination) =>
      `${API_DOMAIN}/lot/transaction?page=${page}&limit=${limit}&type=${type}`,
    IMPORT_ITEM: `${API_DOMAIN}/lot`,
    GET_STOCK_DETAIL_BY_ID: (stockId: string) =>
      `${API_DOMAIN}/lot?stock_id=${stockId}`,
    SEARCH_TAG_ID: `${API_DOMAIN}/lot/search-product`,
    EXPORT_ITEM: `${API_DOMAIN}/lot/export`,

    PUT_IDLOT: `${API_DOMAIN}/lot/tracking-generator`,
  },
};

@Injectable()
export class StockService {
  constructor(private readonly http: HttpClient) {}

  getAllStock(pageConfig: IPagination): Observable<IStockPagination> {
    return this.http.get<IStockPagination>(ENDPOINT.STOCK.GET_ALL(pageConfig), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  addNewStock(data: any): Observable<any> {
    return this.http.post<any>(ENDPOINT.STOCK.ADD, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  updateStock(data: any): Observable<any> {
    return this.http.patch<any>(ENDPOINT.STOCK.UPDATE, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  getAllLotByType(pageConfig: IPagination): Observable<IStockPagination> {
    return this.http.get<IStockPagination>(
      ENDPOINT.LOT.GET_ALL_TRX(pageConfig),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      }
    );
  }

  importItem(data: any): Observable<any> {
    return this.http.post<any>(ENDPOINT.LOT.IMPORT_ITEM, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  exportItem(data: any): Observable<any> {
    return this.http.post<any>(ENDPOINT.LOT.EXPORT_ITEM, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  getStockDetailById(stockId: string): Observable<any> {
    return this.http.get<any>(ENDPOINT.LOT.GET_STOCK_DETAIL_BY_ID(stockId), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  getAllStockUnBinding() {
    return this.http.get<any>(ENDPOINT.STOCK.GET_ALL_UNBINDING, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  searchTagId(tagId: string) {
    let data = { tracking: tagId };
    return this.http.post<any>(ENDPOINT.LOT.SEARCH_TAG_ID, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  printBarcodeByLotId(lotId: string) {
    const data = { id: lotId };
    return this.http.put<any>(ENDPOINT.LOT.PUT_IDLOT, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }
}
