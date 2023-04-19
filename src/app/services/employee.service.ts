import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, EmployeePagination } from 'src/app/model/employee.model';
import { API_DOMAIN } from 'src/utils/utils';

// import { map } from 'rxjs/operators';

interface Pagination {
  page: number;
  limit: number;
  query?: string;
}

const ENDPOINT = {
  GET_ALL: ({ page, limit, query }: Pagination) =>
    `${API_DOMAIN}/employee?page=${page}&limit=${limit}&query=${query}`,
  CREATE: `${API_DOMAIN}/employee`,
  DELETE: (employeeId: string) => `${API_DOMAIN}/employee/${employeeId}`,
  UPDATE: `${API_DOMAIN}/employee`,
};

@Injectable()
export class EmployeeService {
  constructor(private readonly http: HttpClient) {}

  getAllEmployee(pageConfig: Pagination): Observable<EmployeePagination> {
    return this.http.get<EmployeePagination>(ENDPOINT.GET_ALL(pageConfig), {
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
