import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IDataService, ResultWrapper } from '../shared/models/IDataService';
import { BaseService } from './base.service';
import { environment } from '../../environments/environment';
import { AlertService } from './alert.service';
import { HttpService } from '../core/services/http.service';
import { DataAndTotalCountResult } from '@shared/models/api/DataAndTotalCountResult';
import { TeamWithRole } from '@shared/models/api/Role';

//group = organization = company = team

// TODO: add to a different file and add all properties
export interface Group {
    name: string;
    parentGroupId: string;
    id: string;
    children: Group[];
}

@Injectable({
    providedIn: 'root',
})
export class GroupService extends BaseService implements IDataService {

    constructor(private http: HttpClient, private alertService: AlertService, private httpService: HttpService) { super(); }

    public static GROUP_PATH: string = "/groups/projects";

    getData(query: any): Observable<ResultWrapper> {
        var path = (!query || !query.path) ? GroupService.GROUP_PATH : query.path;
        var fullUrl: string = this.getWithQueryParameters(environment.apiUrl + path, query);
        return this.http.get<ResultWrapper>(fullUrl);
    }

    async createNewProject(name: string, groupId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            //this.http.post(`${environment.apiUrl}/` + groupId + `/projects`, null, { params: queryParams })
            this.http.post(`${environment.apiUrl}/` + groupId + `/projects`, { "Name": name }, { observe: 'response' })
                .subscribe((response: any) => {
                    try {
                        if (response.status === 201) {
                            console.log("Created ... item created and default role assigned successfully ... transaction committed");
                        } else if (response.status === 204) {
                            console.log("No Content ... request formally OK but item creation or role assignment failed (for example role not found in DB ...) ... transaction aborted")
                        }
                        resolve({ successful: true, response: response });
                    }
                    catch (err) {
                        console.log("error occured");
                    }

                },
                    (error) => {
                        if (error.status === 403) {
                            console.log("Forbidden ... user is logged in but does not have a permission to create item");
                            this.alertService.error('alert_project_create_failed_permission', 'alert_project_create_failed_permission_subtitle', null, 10000);
                        } else if (error.status === 400) {
                            console.log("Bad Request ... project name validation failed");
                            this.alertService.error('alert_project_create_failed', 'Bad Request', null, 10000);
                        } else if (error.status === 409 || error.status === 500) {
                            console.log("Internal Server Error ... unique constraint violated (item name is not unique within a given company)");
                            this.alertService.error('alert_project_create_failed_validationOfName', 'alert_project_create_failed_validationOfName_subtitle', null, 10000);
                        }
                        resolve({ successful: false, response: error });
                    })
        });
    }

    async getCompanyRoles(query: any): Promise<DataAndTotalCountResult<TeamWithRole>> {
        var companyId = (!query || !query.companyId) ? null : query.companyId;
        var path = (!query) ? null : "/groups/" + companyId + "/roles";
        let requestData = {};
        var fullUrl: string = this.getWithQueryParameters(path, query);
        return this.httpService.get(fullUrl, requestData);
    }

    async getCurrentUserCompanyRoles(companyId: string, email: string): Promise<TeamWithRole> {
        let queryParams = new HttpParams();
        queryParams = queryParams.append(`projectId`, companyId);
        return this.httpService.get("/groups/" + companyId + "/roles", null)
            .then(
                //response 200
                (res: DataAndTotalCountResult<TeamWithRole>) => {
                    let result = null;
                    res.data.forEach(el => {
                        if (el.user.email === email) {
                            result = el;
                        }
                    });
                    return result;
                },
                // not 200
                err => {
                    throwError(err);
                    return false;
                }
            );
    }
}
