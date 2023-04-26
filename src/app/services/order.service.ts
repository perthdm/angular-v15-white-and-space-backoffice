import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_DOMAIN } from 'src/utils/utils';

// import { map } from 'rxjs/operators';

interface Pagination {
  page: number;
  limit: number;
  query?: string;
}

const ENDPOINT = {
  GET_ALL: ({ start, end }: any) =>
    `${API_DOMAIN}/order?start=${start}&end=${end}`,
  CASH_ORDER: `${API_DOMAIN}/order/employee-confirm-cash`,
  BANKING_ORDER: `${API_DOMAIN}/order/employee-confirm-banking`,
};

@Injectable()
export class OrderService {
  constructor(private readonly http: HttpClient) {}

  getAllBill(reqConfig: any): Observable<any> {
    return this.http.get<any>(ENDPOINT.GET_ALL(reqConfig), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  checkOutCashOrder(data: any): Observable<any> {
    return this.http.post<any>(ENDPOINT.CASH_ORDER, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  checkOutBankingOrder(data: any): Observable<any> {
    return this.http.post<any>(ENDPOINT.BANKING_ORDER, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }
}
