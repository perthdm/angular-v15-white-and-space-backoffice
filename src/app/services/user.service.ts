import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, getStorage } from 'src/utils/utils';
import { IUser, IUserPagination } from '../model/user.model';
import { IPagination } from '../model/pagination.model';
// import { map } from 'rxjs/operators';

const ENDPOINT = {
  GET_ALL: ({ page, limit, query }: IPagination) =>
    `${API_URL}/user?page=${page}&limit=${limit}&query=${query}`,
  ADD: `${API_URL}/user`,
  UPDATE: `${API_URL}/user`,
  DELETE: (userId: string) => `${API_URL}/user/${userId}`,
  GET_PROFILE: `${API_URL}/auth/profile`,

  ATTENDANCE: {
    GET_CHECK_IN_STATUS: `${API_URL}/attendance/check-in`,
    CHECK_IN: `${API_URL}/attendance/check-in`,
    CHECK_OUT: `${API_URL}/attendance/check-out`,
    SET_MAN_DAY: `${API_URL}/attendance/set-pay`,
    GET_WORK_INFO: `${API_URL}/attendance/summary-date`,
    GET_CHECKIN_HITSORY: ({ start, end }: any) =>
      `${API_URL}/attendance?start=${start}&end=${end}`,
    GET_CHECKIN_HISTORY_SELF: ({ start, end }: any) =>
      `${API_URL}/attendance/self?start=${start}&end=${end}`,
  },

  SUBMIT_PAY: `${API_URL}/pay-cycle`,
  GET_PAY_CYCLE: ({ page, limit, query }: IPagination) =>
    `${API_URL}/pay-cycle?page=${page}&limit=${limit}&query=${query}`,
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

  getCheckInHistory(dataConfig: any) {
    let urlEndpoint =
      getStorage('role') === 'owner'
        ? ENDPOINT.ATTENDANCE.GET_CHECKIN_HITSORY
        : ENDPOINT.ATTENDANCE.GET_CHECKIN_HISTORY_SELF;

    return this.http.get<any>(urlEndpoint(dataConfig), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  setManDayHours(data: any) {
    return this.http.post<any>(ENDPOINT.ATTENDANCE.SET_MAN_DAY, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  // === ATTENDANCE ===
  getCheckInStatus() {
    return this.http.get<any>(ENDPOINT.ATTENDANCE.GET_CHECK_IN_STATUS, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  checkIn(userId: string) {
    let data = { user_id: userId };
    return this.http.post<any>(ENDPOINT.ATTENDANCE.CHECK_IN, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  checkOut(user_id: string, attendanceId?: string) {
    return this.http.post<any>(
      ENDPOINT.ATTENDANCE.CHECK_OUT,
      {
        user_id,
        attendance_id: attendanceId,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      }
    );
  }

  getWorkInfo(data: any) {
    return this.http.post<any>(ENDPOINT.ATTENDANCE.GET_WORK_INFO, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  createPay(data: any) {
    return this.http.post<any>(ENDPOINT.SUBMIT_PAY, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  getPayCycle(pageConfig: any): Observable<IUserPagination> {
    return this.http.get<IUserPagination>(ENDPOINT.GET_PAY_CYCLE(pageConfig), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  deleteUser(userId: string): Observable<IUserPagination> {
    return this.http.delete<IUserPagination>(ENDPOINT.DELETE(userId), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }
}
