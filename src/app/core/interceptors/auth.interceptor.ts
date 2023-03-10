import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, tap } from "rxjs/operators";
import { Observable, throwError, Subject, defer, iif } from 'rxjs';
import { AuthService } from '../guards/auth.service';
import { RightSidePanelContentConfig } from '@shared/models/RightSidePanelContentConfig';

@Injectable({
  providedIn: 'root',
})
export class AuthHeaderInterceptor implements HttpInterceptor {

  private refreshTokenInProgress = false;
  private pendingRequest: Array<() => any> = [];
  constructor(private authService: AuthService) {

  }

  cloneRequest(request) {
    const isRefresh = request.body && request.body.refreshToken;
    const jwtToken = isRefresh ? this.authService.getRefreshToken() : this.authService.getToken();
    // Add authorization header with token if available   
    if (jwtToken) {
      request = request.clone({
        setHeaders: {
          'Authorization-Key': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });
    }
    return request;
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //adapth header and make request including a token
    request = this.cloneRequest(request);
    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
      var $subj = new Subject<HttpEvent<any>>();

      //ignore errors in case of logout http request
      if (request.body && request.body.doNotRefreshToken) {
        return throwError(error);
      }

      //process error
      switch (error.status) {
        // when token expired
        case 401: {
          // if the refresh token is in the progress, 
          //push all 401 requests into pending array 
          if (this.refreshTokenInProgress) {
            this.pendingRequest.push(() => {
              next.handle(this.cloneRequest(request))
                .subscribe(observer => {
                  $subj.next(observer);
                });
            })
          }else{
          //call refresh token 
          this.refreshTokenInProgress = true;          
          this.authService.refreshToken().then(() => {
          //refresh token is done  
            this.refreshTokenInProgress = false;
            //call previous 401 request which refresh token triggered
            next.handle(this.cloneRequest(request))
                .subscribe(observer => {
                  $subj.next(observer);
                });
            //execute all pending requests which were called during refresh token      
            this.pendingRequest.forEach((fn) => fn());
            
          }).catch(()=>{
            this.refreshTokenInProgress = false;
          }).finally(()=>{
            // clear pending array
            this.pendingRequest = [];
          });
        }
        }
        break;
        case 404: {
          this.authService.noAccess();
        }
        break;
        default: {
          return throwError(error);
        }
      }
      return $subj.asObservable();
    }))
  }
}
