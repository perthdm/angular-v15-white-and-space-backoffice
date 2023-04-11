import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Staff } from 'src/app/model/staff.model';
// import { API_DOMAIN } from '../utility/utils';
// import { map } from 'rxjs/operators';

let API_DOMAIN = 'https://randomuser.me';
const ENDPOINT = {
  GET_USER: `${API_DOMAIN}/api`,
};

@Injectable()
export class StaffService {
  constructor(private readonly http: HttpClient) {}

  getStaff(): Observable<Staff> {
    return this.http.get<Staff>(ENDPOINT.GET_USER);
  }
}
