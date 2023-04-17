import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeePagination } from 'src/app/model/employee.model';
import { API_DOMAIN } from 'src/utils/utils';

// import { map } from 'rxjs/operators';

interface Pagination {
  page: number;
  limit: number;
  query?: string;
}

const ENDPOINT = {
  GET_EMPLOYEE: ({ page, limit, query }: Pagination) =>
    `${API_DOMAIN}/employee?page=${page}&limit=${limit}&query=${query}`,
  ADD_EMPLOYEE: `${API_DOMAIN}/employee`,
};

@Injectable()
export class EmployeeService {
  constructor(private readonly http: HttpClient) {}

  getAllEmployee(pageConfig: Pagination): Observable<EmployeePagination> {
    return this.http.get<EmployeePagination>(
      ENDPOINT.GET_EMPLOYEE(pageConfig),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      }
    );
  }

  addEmployee(data: any): Observable<any> {
    return this.http.post<any>(ENDPOINT.ADD_EMPLOYEE, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }
}
