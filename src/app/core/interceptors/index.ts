/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHeaderInterceptor } from './auth.interceptor';
import { LogsInterceptor } from './logs.interceptor';
import { environment } from '../../../environments/environment';

/** Http interceptor providers in outside-in order */

let _httpInterceptorProviders:Array<any> = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthHeaderInterceptor, multi: true }
];

if(environment.testmode){
 _httpInterceptorProviders.push({ provide: HTTP_INTERCEPTORS, useClass: LogsInterceptor, multi: true })
}
export const httpInterceptorProviders = _httpInterceptorProviders; 