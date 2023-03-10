import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService } from './base.service';
import { AlertService } from './alert.service';
import { InboxService } from './inbox.service';
import { HttpService } from '../core/services/http.service';
import { IDataAndTotalCountService } from '@shared/models/IDataAndTotalCountService';
import { DataAndTotalCountResult, IDataAndTotalCountResultTemplate } from '@shared/models/api/DataAndTotalCountResult';
import { ProjectDocument } from '@shared/models/api/ProjectDocument';
import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProjectDocumentsService extends BaseService implements IDataAndTotalCountService<IDataAndTotalCountResultTemplate> {

    constructor(private http: HttpClient, private alertService: AlertService, private inboxService: InboxService, private httpService: HttpService) { super(); }

    async getData(query: any): Promise<DataAndTotalCountResult<ProjectDocument>> {
        var projectId = (!query || !query.projectId) ? null : query.projectId;
        var path = (!query) ? null : "/projects/" + projectId + "/documents";
        var fullUrl: string = this.getWithQueryParameters(path, query);
        return this.httpService.get(fullUrl, {})
            .then(
                //response 200
                (res: DataAndTotalCountResult<ProjectDocument>) => {
                    return res;
                },
                // not 200
                err => {
                    return err;
                }
            );
    }


    async revisionDownload(queryParams: HttpParams, downloadName: string) {
        return this.inboxService.revisionDownload(queryParams, downloadName);
    }

    async getDocumentDetail(revisionId: string): Promise<any> {
        let requestData = {};
        return this.httpService.get('/documents/' + revisionId + '/details', requestData)
            .then(
                //response 200
                (res: any) => {
                    if (res) {
                        res["layoutData"].revisionId = revisionId;
                        res["layoutData"].cadProject = res["cadProject"];
                        return res;
                    }
                    return false;
                },
                // not 200
                err => {
                    return false
                }
            );
    }

    async DeleteDocuments(documents: ProjectDocument[]): Promise<any> {
        let queryParams = new HttpParams();
        documents.forEach(doc => {
            queryParams = queryParams.append("id", doc.fileItemId);
        });
        return this.httpService.delete('/documents?' + queryParams.toString(), {});
    }

}
