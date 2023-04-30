import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_DOMAIN, getStorage } from 'src/utils/utils';
import { IUser, IUserPagination } from '../model/user.model';
import { IPagination } from '../model/pagination.model';
// import { map } from 'rxjs/operators';

const ENDPOINT = {
  GET_ALL: ({ page, limit, query }: IPagination) =>
    `${API_DOMAIN}/user?page=${page}&limit=${limit}&query=${query}`,
  ADD: `${API_DOMAIN}/user`,
  UPDATE: `${API_DOMAIN}/user`,
  CHECK_IN: `${API_DOMAIN}/attendance`,
  GET_CHECKIN_HITSORY: ({ start, end }: any) =>
    `${API_DOMAIN}/attendance?start=${start}&end=${end}`,
  GET_CHECKIN_HISTORY_SELF: ({ start, end }: any) =>
    `${API_DOMAIN}/attendance/self?start=${start}&end=${end}`,
  GET_PROFILE: `${API_DOMAIN}/auth/profile`,
};

@Injectable()
export class UserService {
  constructor(private readonly http: HttpClient) {}

  getProfile() {
    return this.http.get<IUser>(ENDPOINT.GET_PROFILE, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  getAllUser(pageConfig: any): Observable<IUserPagination> {
    return this.http.get<IUserPagination>(ENDPOINT.GET_ALL(pageConfig), {
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

  employeeCheckIn() {
    let data = { action: 'Check In' };
    return this.http.put<any>(ENDPOINT.CHECK_IN, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  getCheckInHistory(dataConfig: any) {
    let urlEndpoint =
      getStorage('role') === 'owner'
        ? ENDPOINT.GET_CHECKIN_HITSORY
        : ENDPOINT.GET_CHECKIN_HISTORY_SELF;

    return this.http.get<any>(urlEndpoint(dataConfig), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }
}
