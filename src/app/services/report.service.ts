import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { resolve } from 'dns';
import { HttpService } from '../core/services/http.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private alertService: AlertService,
    private httpService: HttpService) { }

  async downloadReport(projectId: string): Promise<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("projectId", projectId);
    queryParams = queryParams.append("includeAllRevisions", true);
    queryParams = queryParams.append("colored", true);
    queryParams = queryParams.append("format", "html");
    queryParams = queryParams.append("timeZone", Intl.DateTimeFormat().resolvedOptions().timeZone);
    return this.httpService.get('/report?' + queryParams.toString(), {}, "text");

  }

}
