import { Injectable } from "@angular/core";
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable } from 'rxjs';
import { map } from "rxjs/operators"
import { AuthService } from "./auth.service";
import { User } from 'src/app/shared/models/api/User';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {



    //public login
    if (!this.authService.isAuthenticated && next.routeConfig.path == 'login') {
      return true;
    }

    if (!this.authService.isAuthenticated && next.routeConfig.path == 'confirmtermsofuse') {
      this.router.navigate(['/login']);
      return false;
    }

    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/login'], { queryParams: { redirectTo: state.url } });
      return false;
    }

    if (this.authService.isAuthenticated && this.authService.currentUser.lastTosAccepted && next.routeConfig.path == 'login') {
      this.router.navigate(['/']);
      return true;
    }

    if (this.authService.isAuthenticated && this.authService.currentUser.lastTosAccepted && next.routeConfig.path == 'confirmtermsofuse') {
      this.router.navigate(['/']);
      return true;
    }


    if (this.authService.isAuthenticated && !this.authService.currentUser.lastTosAccepted && next.routeConfig.path !== 'confirmtermsofuse') {
      this.router.navigate(['/confirmtermsofuse']);
      return true;
    }

    // const roles = this.getRoless(next.data['role']);
    // if (roles.length > 0 && !roles.some(r => r == this.authService.currentUser.role)) {
    //   this.router.navigate(['accessdenied']);
    //   return false;
    // }
    return true;

  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(next, state);
  }


}
