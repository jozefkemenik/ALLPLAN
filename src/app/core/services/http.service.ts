import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class HttpService {
  private token: string;
  constructor(private http: HttpClient) { }

  setToken(token) {
    this.token = token;
  }

  private getHeader() {
    return { 'Access-Control-Allow-Origin': '*', 'Content-type': 'application/json' };
  }

  private fullUrl(url: string): string {
    return environment.apiUrl.replace(/\/+$/, '') + '/' + url.replace(/^\/+/, '');
  }

  post(url: string, payload: any): Promise<any> {
    return new Promise((res, rej) => {
      this.http.post<any>(this.fullUrl(url), payload, { headers: this.getHeader() })
        .subscribe(data => {
          res(data)
        },
          err => {
            rej(err)
          })
    })
  }

  delete(url: string, payload: any): Promise<any> {
    return new Promise((res, rej) => {
      this.http.delete<any>(this.fullUrl(url), {
        headers: this.getHeader(),
        params: payload
      })
        .subscribe(data => {
          res(data)
        },
          err => {
            rej(err)
          })
    })
  }

  get(url: string, payload: any, responseType?: any): Promise<any> {    
    let options = {
      headers: this.getHeader(),
      params: payload,
      
    };

    if (responseType) options['responseType'] = responseType;
    return new Promise((res, rej) => {
      this.http.get<any>(this.fullUrl(url), options)
        .subscribe(data => {
          res(data)
        },
          err => {
            rej(err)
          })
    })
  }

  getFileFromAssets(file): Promise<any> {
    file = file.replace(/\/\//g, '/');
    return this.http.get('/assets/' + file).toPromise()
  }

  getParameterByName(name, url = window.location.href):string {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  setParameterByName(name, value ):string{
    const currentValue = this.getParameterByName(name);
    const url  = window.location.href;
    if(currentValue){
     return  url.replace(`${name}=${currentValue}`,`${name}=${value}`)
    }
    if(url.includes("?")){
      return  `${url}&${name}=${value}`;
    }
    return  `${url}?${name}=${value}`;
  }

  removeParameterByName(name):string{
    const currentValue = this.getParameterByName(name);
    var url  = window.location.href;
    if(currentValue){
       url = url.replace(`&${name}=${currentValue}`,'')
       url = url.replace(`${name}=${currentValue}&`,'')
       url = url.replace(`?${name}=${currentValue}`,'')
    }
    return url;
  }

  getTabIndex():number{
    const tabInedStr = this.getParameterByName('tab');
    if(!tabInedStr){
      return 0;
    }
    return Number(tabInedStr);
  }
  setTabIndex(index:number){  
    var url = this.setParameterByName('tab',index);
    if(index==0){
      url = this.removeParameterByName('tab')
    }
    window.history.pushState({name:"tab="+index}, '', url); 
    
  }

  makeJsonFromQuey(str="") {
    str = decodeURIComponent(str);
    var chunks = str.split('&'),
        obj = {};
    for(var c=0; c < chunks.length; c++) {
      var split = chunks[c].split('=', 2);
      obj[split[0]] = split[1];
    }
    return obj;
  }
}
