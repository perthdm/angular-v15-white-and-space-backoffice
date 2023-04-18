import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_DOMAIN } from 'src/utils/utils';
import { IProductPagination } from '../model/product.model';

// import { map } from 'rxjs/operators';

interface Pagination {
  page: number;
  limit: number;
  query?: string;
}

const ENDPOINT = {
  GET_ALL: ({ page, limit, query }: Pagination) =>
    `${API_DOMAIN}/product?page=${page}&limit=${limit}&query=${query}`,
};

@Injectable()
export class ProductService {
  constructor(private readonly http: HttpClient) {}

  getAllProduct(pageConfig: Pagination): Observable<IProductPagination> {
    return this.http.get<IProductPagination>(ENDPOINT.GET_ALL(pageConfig), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  //   addEmployee(data: any): Observable<any> {
  //     return this.http.post<any>(ENDPOINT.CREATE, data, {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       }),
  //     });
  //   }

  //   deleteEmployee(employeeId: string): Observable<any> {
  //     return this.http.delete<any>(ENDPOINT.DELETE(employeeId), {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       }),
  //     });
  //   }

  //   updeteEmployee(data: any): Observable<any> {
  //     return this.http.patch<any>(ENDPOINT.UPDATE, data, {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       }),
  //     });
  //   }
}
