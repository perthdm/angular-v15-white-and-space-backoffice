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
  CHECK_IN: `${API_URL}/attendance`,
  GET_CHECKIN_HITSORY: ({ start, end }: any) =>
    `${API_URL}/attendance?start=${start}&end=${end}`,
  GET_CHECKIN_HISTORY_SELF: ({ start, end }: any) =>
    `${API_URL}/attendance/self?start=${start}&end=${end}`,
  GET_PROFILE: `${API_URL}/auth/profile`,
  SET_MAN_DAY: `${API_URL}/attendance/set-pay`,

  ATTENDANCE: {
    GET_CHECK_IN_STATUS: `${API_URL}/attendance/check-in`,
    CHECK_IN: `${API_URL}/attendance/check-in`,
    CHECK_OUT: `${API_URL}/attendance/check-out`,
  },
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

  // employeeAttendance(userId: string) {
  //   let data = { user_id: userId };
  //   return this.http.put<any>(ENDPOINT.ATTENDANCE.CHECK_IN, data, {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     }),
  //   });
  // }

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

  setManDayHours(data: any) {
    return this.http.post<any>(ENDPOINT.SET_MAN_DAY, data, {
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

  checkIn(user_id: string) {
    return this.http.post<any>(
      ENDPOINT.ATTENDANCE.CHECK_IN,
      {
        user_id,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      }
    );
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
}
