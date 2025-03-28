import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ENV } from 'src/environments/environment';
import { API_URL } from 'src/utils/utils';

const ENDPOINT = {
  SIGN_IN: `${API_URL}/auth/login`,
};

@Injectable()
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  signIn(data: any): Observable<any> {
    return this.http.post(ENDPOINT.SIGN_IN, data);
  }
}

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.permissionCheck(state.url);
  }

  permissionCheck(url: string): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['']);
      return false;
    }

    // if (url === '/login' || url === '/') {
    //   if (token) {
    //     this.router.navigate(['/dashboard']);
    //   }
    // }
    // this.router.navigate(['/dashboard']);
    return true;
  }
}
