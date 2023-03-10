import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse ,HttpErrorResponse} from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class LogsInterceptor implements HttpInterceptor {
  private attempts=[];

  pushLog(val:any){
   

    this.attempts.push(val);
    if(this.attempts.length>6){
      this.attempts.shift();
    }

    if(val.status!=="OK"){
        var logs = [];
        var strLogs = localStorage.getItem('httplogs');
        if(strLogs) logs= JSON.parse(strLogs);
        logs=logs.concat(this.attempts)
        localStorage.setItem('httplogs',JSON.stringify(logs));
        this.attempts=[];
    }
    if( val.status=="OK" && val.elapsedTime>3000){
      var logs = [];
      var strLogs = localStorage.getItem('httplogs');
      if(strLogs) logs= JSON.parse(strLogs);
      logs.push(val)
      localStorage.setItem('httplogs',JSON.stringify(logs));
  }
  
  }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //skip local fetch
    if(!req.url.startsWith(environment.apiUrl)){
      return next.handle(req);
    }
    const startTime = Date.now();
    let status: string;

    return next.handle(req).pipe(
        tap(
          event => {
            status = '';
            if (event instanceof HttpResponse) {
              status = 'OK';
            }
          },
          (error: HttpErrorResponse) => status = '' + error.status
        ),
        finalize(() => {
          this.logDetails(startTime, status, req)
        })
    );
  }
  private logDetails(startTime: number, status: string, req:HttpRequest<any>) {
    const startDate = new Date(startTime);
    const elapsedTime = Date.now() - startTime;
    
    var datestring = ("0" + startDate.getDate()).slice(-2) + "-" + ("0"+(startDate .getMonth()+1)).slice(-2) + "-" 
    +startDate .getFullYear() + " " 
    + ("0" + startDate .getHours()).slice(-2)
    + ":" 
    + ("0" + startDate .getMinutes()).slice(-2)
    + ":" 
    + ("0" + startDate .getSeconds()).slice(-2);


    try {   
     const log = {status:status, on:datestring, takes:elapsedTime, api:`${req.method} ${ req.urlWithParams}`}; 
     this.pushLog(log)
    }catch(e){
      localStorage.setItem('httplogs',JSON.stringify([]));
    }
  }
}