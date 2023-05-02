import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from 'src/utils/utils';

const ENDPOINT = {
  GET: `${API_URL}/cafe`,
  UPDATE: `${API_URL}/cafe`,
};

@Injectable()
export class CafeService {
  constructor(private readonly http: HttpClient) {}

  getCafe(): Observable<any> {
    return this.http.get<any>(ENDPOINT.GET, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  updateCafe(data: any): Observable<any> {
    return this.http.patch<any>(ENDPOINT.UPDATE, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }
}
