import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserPagination } from 'src/app/model/user.model';
import { API_URL } from 'src/utils/utils';
import { IPagination } from '../model/pagination.model';

// import { map } from 'rxjs/operators';

const ENDPOINT = {
  GET_ALL: ({ page, limit, query }: IPagination) =>
    `${API_URL}/employee?page=${page}&limit=${limit}&query=${query}`,
  CREATE: `${API_URL}/employee`,
  DELETE: (employeeId: string) => `${API_URL}/employee/${employeeId}`,
  UPDATE: `${API_URL}/employee`,
};

@Injectable()
export class EmployeeService {
  constructor(private readonly http: HttpClient) {}

  getAllEmployee(pageConfig: IPagination): Observable<IUserPagination> {
    return this.http.get<IUserPagination>(ENDPOINT.GET_ALL(pageConfig), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  addEmployee(data: any): Observable<any> {
    return this.http.post<any>(ENDPOINT.CREATE, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  deleteEmployee(employeeId: string): Observable<any> {
    return this.http.delete<any>(ENDPOINT.DELETE(employeeId), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  updeteEmployee(data: any): Observable<any> {
    return this.http.patch<any>(ENDPOINT.UPDATE, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }
}
