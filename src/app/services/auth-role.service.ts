import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { getStorage } from 'src/utils/utils';

@Injectable({
  providedIn: 'root',
})
export class AuthRoleService implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // Get the expected role from the route data
    // const expectedRole = next.data.role;

    // // Get the current user from local storage
    // const role = getStorage('role');

    // // If the user has the expected role, allow access to the route
    // if (role == 'owner' || role == 'admin') {
    //   return true;
    // }
    // return true;
    // Otherwise, redirect to an unauthorized page

    let url: string = state.url;
    return this.checkRoleForAccess(next, url);
  }

  checkRoleForAccess(next: ActivatedRouteSnapshot, url: any) {
    let role = getStorage('role');

    if (!role) {
      this.router.navigate(['']);
      return false;
    }

    if (next.data['roles'].indexOf(role) !== -1) {
      return true;
    }
    this.router.navigate(['/shop']);
    return false;
  }
}
