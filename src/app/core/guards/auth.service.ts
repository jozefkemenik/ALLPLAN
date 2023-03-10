import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { EDialogType } from './auth.model';
import { HttpService } from '../services/http.service';
import { User } from 'src/app/shared/models/api/User';

export class ConfirmInvitation {
  firstName: string;
  lastName: string;
  id: string;
  password: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private currentUserSubject: Subject<User>;
  private dialogSubject: Subject<EDialogType>;
  public currentUser: User;


  constructor(private router: Router, private httpService: HttpService) {

    this.dialogSubject = new Subject<EDialogType>();
    this.currentUserSubject = new Subject<User>();

    this.currentUser = this.loadUserFromLS();
    this.currentUserSubject.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.httpService.setToken(user.token);
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        this.httpService.setToken(null);
        localStorage.removeItem('currentUser');
      }
    });

    this.registerEventOnTabFocus();
  }


  loadUserFromLS(): User {
    const lsUser = localStorage.getItem('currentUser');
    if (lsUser) {
      return JSON.parse(lsUser);
    }
    return null;
  }

  reloadSession() {
    //triger open dialog
    this.dialogSubject.next(EDialogType.relogin);;
  }

  noAccess() {
    this.router.navigate(['/noaccess']);
  }

  // the fn is a open dialog promise function which return result of user action by pushing buttons (cancel or login)
  subscribeDialog(fntype: EDialogType, fn: () => Promise<boolean>) {
    this.dialogSubject.subscribe({
      next: (type) => {
        if (fntype == type) {
          switch (fntype) {
            case EDialogType.relogin: {
              //show dialog
              fn();
            } break;
            case EDialogType.noacces: {
              //show dialog
              fn();
            } break;
          }
        }
      }
    })
  }

  public testDamageToken(isRefresh: boolean) {
    if (this.isAuthenticated) {
      var user = this.currentUser;
      if (isRefresh) {
        user.refreshToken += "_";
      } else {
        user.token += "_";
      }
      this.currentUserSubject.next(user);
    }
  }

  public set rememberMe(val: boolean) {
    localStorage.setItem('remeberme', JSON.stringify(val));
  }
  public get rememberMe(): boolean {
    const remeberme = localStorage.getItem('remeberme');
    return remeberme && JSON.parse(remeberme);
  }

  public refreshToken(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isAuthenticated) {
        var payLoad = { refreshToken: true, doNotRefreshToken: true }
        this.httpService.post('/refreshToken', payLoad)
          .then(
            (res) => {
              this.currentUser.token = res.token;
              this.currentUser.refreshToken = res.refreshToken
              this.currentUserSubject.next(this.currentUser);
              resolve(true)
            },
            (err) => {
              this.logout();
              reject(err);
            })
          .catch((err) => {
            this.logout();
            throw new Error(err);
          })
      } else {
        reject("refresh token is not valid");
      }
    });
  }

  // login user - call API from Integration platform
  login(username: string = null, password: string = null): Promise<boolean> {
    var payLoad = { doNotRefreshToken: true, email: username, password: password };
    return new Promise<boolean>((resolve, reject) => {
      this.httpService.post('/login', payLoad)
        .then(
          //response 200
          (res: any) => {
            if (res) {
              this.currentUserSubject.next(res as User);
              Promise.all([this.getUser(), this.loadUserRole()]).then(r => resolve(true));
            }
            else reject(false);
          },
          // not 200
          err => {
            this.resetUser();
            reject(err);
          }
        )
    })
  }
  getUser(): Promise<boolean> {
    return this.httpService.get('/user', null).then(r => {
      this.setUser(Object.assign(this.currentUser, r))
      return true;
    });
  }
  loadUserRole(): Promise<any> {
    return this.httpService.get('roles', null).then((r) => {
      this.currentUser.roles = r.userRoles;
      this.setUser(this.currentUser);
    });
  }

  confirmInvitation(payLoad: ConfirmInvitation) {
    return new Promise((res, rej) => {
      this.httpService.post('/users/confirmInvitation', Object.assign(payLoad, { doNotRefreshToken: true })).then(
        r => this.login(payLoad.email, payLoad.password).then(() => res(null), err => rej(err)),
        err => rej(err))
        .catch((err) => {
          rej(err);
        });
    })
  }

  isRegistered(id: string): Promise<any> {
    return this.httpService.get('users/confirmed', { id: id, doNotRefreshToken: true });
  }



  setUser(user: User) {
    this.currentUserSubject.next(user);
  }



  acceptTerms() {
    this.currentUser.lastTosAccepted = true;
    this.currentUserSubject.next(this.currentUser);
    this.router.navigate(['/']);
  }

  getToken() {
    return this.isAuthenticated ? this.currentUser.token : null;
  }
  getRefreshToken() {
    return this.isAuthenticated ? this.currentUser.refreshToken : null;
  }

  //registration user - call API from Integration platform
  register(formData): Promise<string> {
    var data = {
      UserName: formData.username,
      Email: formData.email,
      Password: formData.password,
    }
    return this.httpService.post('/TellStoryUser/Register', data).then(
      (res: any) => {
        if (res.succeeded) {
          this.router.navigate(['/login']);
          return "";
        } else {
          res.errors.forEach(element => {
            switch (element.code) {
              case 'DuplicateUserName':
                return "Duclicate Username";
              //break;
              default:
                return "Unexpected error";
              //break;
            }
          });
        }
      },
      err => {
        this.resetUser();
        return "Wrong username or password";
      }
    );
  }
  checkCurrentUserOnTab() {
    const user = this.loadUserFromLS();

    if (
      //its logout but other primary tab login
      (!this.currentUser && user) ||
      //its login but other primary tab logout
      (this.currentUser && !user) ||
      //different user on other tab
      (this.currentUser && user && this.currentUser.email !== user.email)) {
      window.location.reload();
    }
  }

  // logout authentication user - token to null and navigate to login page
  logout(email: string = null) {
    return this.httpService.post('/logout', { doNotRefreshToken: true }).finally(() => {
      this.rememberMe = false;
      this.resetUser();
      if (email) {
        this.router.navigate(['/login'], { queryParams: { email: email } });
      }
      else {
        this.router.navigate(['/login']);
      }
    });
  }

  // delete cookies object for current user
  private resetUser() {
    this.currentUserSubject.next(null);
  }

  // check that current user is authenticated
  get isAuthenticated(): boolean {
    return !!(this.currentUser && this.currentUser.token);
  }


  registerEventOnTabFocus() {
    const $this = this;
    const options = [{
      hidden: "hidden",
      visibilityChange: "visibilitychange"
    }, {
      hidden: "mozHidden",
      visibilityChange: "mozvisibilitychange"
    }, {
      hidden: "msHidden",
      visibilityChange: "msvisibilitychange"
    }, {
      hidden: "webkitHidden",
      visibilityChange: "webkitvisibilitychange"
    }]
    window.onload = function () {
      const item = options.find(f => typeof document[f.hidden] !== "undefined");
      if (item) {
        document.addEventListener(item.visibilityChange, function () {
          if (!document[item.hidden]) {
            $this.checkCurrentUserOnTab();
          }
        }, false);
      }
    };
    window.addEventListener("UC_SDK_EVENT", (...data) => console.log("MY TEST", ...data));
  }
}