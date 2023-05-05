import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from 'src/utils/utils';

// import { map } from 'rxjs/operators';

const ENDPOINT = {
  GET_ALL: ({ start, end }: any) =>
    `${API_URL}/order?start=${start}&end=${end}`,
  CONFIRM_ORDER: `${API_URL}/order/employee-confirm`,
  BANKING_ORDER: `${API_URL}/order/employee-confirm-banking`,
  CANCEL_ORDER: `${API_URL}/order/cancel`,
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

  checkOutOrder(data: any, payment: string, coin?: number): Observable<any> {
    return this.http.post<any>(
      ENDPOINT.CONFIRM_ORDER,
      { order: data, payment, coin },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      }
    );
  }

  // checkOutBankingOrder(data: any): Observable<any> {
  //   return this.http.post<any>(ENDPOINT.BANKING_ORDER, data, {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     }),
  //   });
  // }

  cancelOrder(id: string): Observable<any> {
    let data = { id };
    return this.http.put<any>(ENDPOINT.CANCEL_ORDER, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }
}
