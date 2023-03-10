import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    constructor(private http: HttpClient) { }

    private urlConfig: any;

    setExternalConfig(urlConfig: any) {
        this.urlConfig = urlConfig;
    }

    getUrlConfig() { return this.urlConfig; }

    // I made delay 500ms for displaying busy loader when app inits for sure it works
    doReadExternalConfig(): Promise<any> {
        return new Promise((resolve, reject) => {
            return this.getUrlConfigJSON().toPromise()
                .then(jsonData => {
                    this.setExternalConfig(jsonData);
                    setTimeout(() => {
                        resolve(jsonData);
                    }, 500);
                },
                    (err => {
                        reject(err);
                    }));
        })
    }

    private getUrlConfigJSON(): Observable<any> {
        return this.http.get(environment.resUrl + '/Exchange/Config/url-config.json')
    }

}
