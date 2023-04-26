import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_DOMAIN } from 'src/utils/utils';
import { IPagination } from '../model/pagination.model';

// import { map } from 'rxjs/operators';

const ENDPOINT = {
  GET_FULL_REPORT: ({ start, end }: any) =>
    `${API_DOMAIN}/order/summary?start=${start}&end=${end}`,
  GET_OVERVIEW_REPORT: ({ page, limit }: IPagination) =>
    `${API_DOMAIN}/report?page=${page}&limit=${limit}`,
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
