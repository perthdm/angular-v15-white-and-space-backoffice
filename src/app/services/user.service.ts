import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserPagination } from 'src/app/model/user.model';
import { API_DOMAIN } from 'src/utils/utils';
// import { map } from 'rxjs/operators';

interface Pagination {
  page: number;
  limit: number;
  query?: string;
}

const ENDPOINT = {
  GET_ALL: ({ page, limit, query }: Pagination) =>
    `${API_DOMAIN}/user?page=${page}&limit=${limit}&query=${query}`,
  ADD: `${API_DOMAIN}/user`,
  UPDATE: `${API_DOMAIN}/user`,
};

@Injectable()
export class UserService {
  constructor(private readonly http: HttpClient) {}

  getAllUser(pageConfig: any): Observable<UserPagination> {
    return this.http.get<UserPagination>(ENDPOINT.GET_ALL(pageConfig), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  addUser(data: any): Observable<any> {
    return this.http.post<any>(ENDPOINT.ADD, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  updateUser(data: any): Observable<any> {
    return this.http.patch<any>(ENDPOINT.UPDATE, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }
}
