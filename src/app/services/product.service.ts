import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_DOMAIN } from 'src/utils/utils';
import { IProductPagination } from '../model/product.model';
import { IPagination } from '../model/pagination.model';

// import { map } from 'rxjs/operators';

const ENDPOINT = {
  GET_ALL: ({ page, limit, type, query }: IPagination) =>
    `${API_DOMAIN}/product?page=${page}&limit=${limit}&type=${type}&query=${query}`,
  CREATE: `${API_DOMAIN}/product`,
  UPDATE: `${API_DOMAIN}/product`,
};

@Injectable()
export class ProductService {
  constructor(private readonly http: HttpClient) {}

  getAllProduct(pageConfig: IPagination): Observable<IProductPagination> {
    return this.http.get<IProductPagination>(ENDPOINT.GET_ALL(pageConfig), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  addProduct(data: any): Observable<any> {
    return this.http.post<any>(ENDPOINT.CREATE, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  updateProduct(data: any): Observable<any> {
    return this.http.patch<any>(ENDPOINT.UPDATE, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  //   deleteEmployee(employeeId: string): Observable<any> {
  //     return this.http.delete<any>(ENDPOINT.DELETE(employeeId), {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       }),
  //     });
  //   }
}
