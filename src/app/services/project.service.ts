import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { IDataService, Action, ResultWrapper } from '../shared/models/IDataService';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { AlertService } from './alert.service';
import { HttpService } from '../core/services/http.service';
import { ProjectWithRole } from '@shared/models/api/Role';
import { DataAndTotalCountResult } from '@shared/models/api/DataAndTotalCountResult';

// TODO: add to a different file and add all properties
export interface Project {
    name: string;
    parentGroupId: string;
    id: string;
}

// TODO real implementation
@Injectable({
    providedIn: 'root',
})
export class ProjectService extends BaseService implements IDataService {

    constructor(private http: HttpClient, private alertService: AlertService, private httpService: HttpService) { super(); }

    getActions(id: string): Action[] {
        var data: Action[] = [];
        if (id.startsWith("0")) {
            data.push({ targetType: "projects", targetId: id, actionName: "delete" });
        }
        data.push({ targetType: "projects", targetId: id, actionName: "getbyid" });
        return data;
    }

    getData(query: any): Observable<ResultWrapper> {
        // pipe(map(projs => projs));
        var fullUrl: string = this.getWithQueryParameters(`${environment.apiUrl}/groups/${query.groupId}/projects`, query);
        return this.http.get<ResultWrapper>(fullUrl);
    }

    getProjectDetails(projectId: string): Observable<Project> {
        return this.http.get<Project>(`${environment.apiUrl}/projects/${projectId}`);
    }

    async deleteProject(projectIds: string[]): Promise<any> {
        let queryParams = new HttpParams();
        projectIds.forEach(value => {
            queryParams = queryParams.append(`id`, value);
        });
        return new Promise((resolve, reject) => {
            this.http.delete(`${environment.apiUrl}/projects/delete`, { params: queryParams, observe: 'response' })
                .subscribe((response: any) => {
                    try {
                        if (response.status === 204) {
                            console.log("No Content ... deletion successfull");
                            this.alertService.success('alert_project_delete_success', "", null, 5000);
                        }
                        resolve({ successful: true, response: response });
                    }
                    catch (err) {
                        console.log("error occured");
                    }
                },
                    (error) => {
                        if (error.status === 401) {
                            console.log("Unauthorized ... user not logged in");
                            this.alertService.error('alert_project_delete_failed_unauthorized', 'alert_project_delete_failed_unauthorized2', null, 10000);
                        }
                        else if (error.status === 500 || error.status === 403 || error.status === 400) {
                            console.log("Internal Server Error");
                            this.alertService.error('alert_project_delete_failed', '', null, 10000);
                        }
                        else if (error.status === 404) {
                            console.log("Project not found");
                            this.alertService.error('alert_project_delete_not_found', 'alert_project_delete_not_found2', null, 10000);
                        } else {
                            console.log("Deleting failed!");
                            this.alertService.error('alert_project_delete_failed', '', null, 10000);
                        }
                        resolve({ successful: false, response: error });
                    })
        });
    }

    async getProjectRoles(projectId: string, email: string): Promise<ProjectWithRole> { //get roles of current log in user
        let queryParams = new HttpParams();
        queryParams = queryParams.append(`projectId`, projectId);
        return this.httpService.get("/projects/" + projectId + "/roles", null)
            .then(
                //response 200
                (res: DataAndTotalCountResult<ProjectWithRole>) => {
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
