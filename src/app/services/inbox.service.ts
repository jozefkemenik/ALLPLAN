import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService } from './base.service';
import { environment } from '../../environments/environment';
import { formatDate } from '@angular/common';
import { AlertService } from './alert.service';
import { DataAndTotalCountResult, IDataAndTotalCountResultTemplate } from '@shared/models/api/DataAndTotalCountResult';
import { HttpService } from '../core/services/http.service';
import { IDataAndTotalCountService } from '@shared/models/IDataAndTotalCountService';
import { InboxDocument } from '@shared/models/api/InboxDocument';


@Injectable({
    providedIn: 'root',
})
export class InboxService extends BaseService implements IDataAndTotalCountService<IDataAndTotalCountResultTemplate> {

    constructor(private http: HttpClient, 
                private alertService: AlertService, 
                private httpService: HttpService) { super(); }

    public static INBOX_DOC_PATH: string = "/inbox/documents";

    async getData(query: any): Promise<DataAndTotalCountResult<InboxDocument>> {
        var path = (!query || !query.path) ? InboxService.INBOX_DOC_PATH : query.path;
        var fullUrl: string = this.getWithQueryParameters(path, query);
        return this.httpService.get(fullUrl, {})
            .then(
                //response 200
                (res: DataAndTotalCountResult<InboxDocument>) => {
                    return res;
                },
                // not 200
                err => {
                    return err;
                }
            );
    }


    async revisionDownload(queryParams: HttpParams, downloadName: string): Promise<any> {
        let isSigleDownload = queryParams.getAll("id").length === 1 ? true : false;
        this.alertService.info('alert_preparing_download', '', null, 5000);
        return new Promise((resolve, reject) => {
            this.http.get(`${environment.apiUrl}/revisions/download`, { params: queryParams, responseType: 'json' })
                .subscribe((data: any) => {
                    try {
                        fetch(data.item1)
                            .then(res => res.blob()) // Gets the response and returns it as a blob
                            .then(blob => {
                                var a = document.createElement("a");
                                a.href = URL.createObjectURL(blob);
                                if (isSigleDownload) {
                                    a.download = downloadName;
                                    resolve({ class: "svg-mat-icon-visited", excluded: [] });
                                } else {
                                    let actualDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
                                    a.download = actualDate + "_EXCHANGE DOWNLOAD.zip";
                                    resolve({ class: "svg-mat-icon-visited", excluded: data.item2 });
                                }
                                a.click();
                                window.URL.revokeObjectURL(data.item1);
                                this.alertService.success('alert_download_success', '', null, 5000);
                            });
                    }
                    catch (err) {
                        this.alertService.error('alert_download_failed', '', null, null);
                        console.log("error occured");
                    }

                },
                    (error) => {
                        this.alertService.error('alert_download_failed', '', null, null);
                        console.log("error ", error);
                        resolve({ class: "svg-mat-icon", excluded: [] });
                    })
        });
    }
}
