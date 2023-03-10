import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { IDataService, ResultWrapper } from '../shared/models/IDataService';


export interface User {
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    title: string;
    jobTitle: string;
    salutation: string;
    id: string;
    exchangeId: number;
    lastLogin?: Date;
    lastlogout?: Date;
    trade: string;
    emailVerified: boolean;
    gender: string;
    language: string;
}



@Injectable({
    providedIn: 'root'
})
export class UserService extends BaseService implements IDataService {

    constructor(private http: HttpClient) { super() }

    getData(query: any): Observable<ResultWrapper> {
        throw new Error("Method not implemented.");
    }

    getUser(id: string): Observable<User> {
        return this.http.get<User>(environment.apiUrl + '/users/' + id);
    }

    getOperations(): Observable<string[]> {
        return this.http.get<string[]>(environment.apiUrl + '/user/operations');
    }

    getUserShowDetail(id: string): Observable<string[]> {
        return this.http.get<string[]>(environment.apiUrl + '/users/' + id + '/assignedRoles');
    }

}
