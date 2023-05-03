import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from 'src/utils/utils';
import { IProductPagination } from '../model/product.model';
import { IPagination } from '../model/pagination.model';

// import { map } from 'rxjs/operators';

const ENDPOINT = {
  GET_ALL: ({ page, limit, type, query }: IPagination) =>
    `${API_URL}/product?page=${page}&limit=${limit}&type=${type}&query=${query}`,
  CREATE: `${API_URL}/product`,
  UPDATE: `${API_URL}/product`,
  DELETE: (productId: string) => `${API_URL}/product/${productId}`,
  PUT:`${API_URL}/product/status`,
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

  updateStatusProduct(productId:any): Observable<any> {
    let data = { id: productId };
    return this.http.put<any>(ENDPOINT.PUT, data, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  addProduct(data: any): Observable<any> {
    return this.http.post<any>(ENDPOINT.CREATE, data, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  updateProduct(data: any): Observable<any> {
    return this.http.patch<any>(ENDPOINT.UPDATE, data, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<any>(ENDPOINT.DELETE(productId), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }
}
