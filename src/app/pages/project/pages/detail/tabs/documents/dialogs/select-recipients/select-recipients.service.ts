import { Injectable } from '@angular/core';
import { DataAndTotalCountResult } from '@shared/models/api/DataAndTotalCountResult';
import { ProjectWithRole } from '@shared/models/api/Role';
import { HttpService } from 'src/app/core/services/http.service';
import { BaseService } from 'src/app/services/base.service';

export class SelectRecipients {
  name: string;
  email: string;
  id: string;
  actionText?: string;
  verified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SelectRecipientsService extends BaseService {

  constructor(private httpService: HttpService) {
    super();
  }

  async getData(query: any): Promise<DataAndTotalCountResult<any>> {
    var projectId = (!query || !query.projectId) ? null : query.projectId;
    var path = (!query) ? null : "/projects/" + projectId + "/roles";
    let requestData = {};
    var fullUrl: string = this.getWithQueryParameters(path, query);
    return this.httpService.get(fullUrl, requestData)
      .then(
        //response 200
        (res: DataAndTotalCountResult<ProjectWithRole>) => {
          let result = new DataAndTotalCountResult<SelectRecipients>();
          res.data.forEach(item => {
            let el = new SelectRecipients();
            el.name = item.user.name;
            el.id = item.user.id;
            el.verified = item.user.emailVerified;
            el.email = item.user.email;
            result.data.push(el);
          });
          result.total = res.total;
          return result;
        },
        // not 200
        err => {
          return err;
        }
      );
  }

  async selectRecipients(requestBody: any): Promise<any> {
    return this.httpService.post("/notifications/download", requestBody);
  }

}
