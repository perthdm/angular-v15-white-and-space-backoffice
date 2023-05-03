import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination } from '../model/pagination.model';
import { API_URL } from 'src/utils/utils';

const ENDPOINT = {
  GET_FULL_REPORT: ({ start, end }: any) =>
    `${API_URL}/order/summary?start=${start}&end=${end}`,
  GET_OVERVIEW_REPORT: ({ page, limit }: IPagination) =>
    `${API_URL}/report?page=${page}&limit=${limit}`,
};

@Injectable()
export class ReportService {
  constructor(private readonly http: HttpClient) {}

  getMonthlyReport(data: any): Observable<any> {
    return this.http.get<any>(ENDPOINT.GET_FULL_REPORT(data), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  getOverviewReport(pageConfig: IPagination): Observable<any> {
    return this.http.get<any>(ENDPOINT.GET_OVERVIEW_REPORT(pageConfig), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }
}
