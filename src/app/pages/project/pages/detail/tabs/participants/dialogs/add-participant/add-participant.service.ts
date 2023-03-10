import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataAndTotalCountResult } from '@shared/models/api/DataAndTotalCountResult';
import { AutocompleteItems } from '@shared/models/autocomplete';
import { HttpService } from 'src/app/core/services/http.service';
import { TranslationService } from 'src/app/core/services/translation.service';
import { BaseService } from 'src/app/services/base.service';
import {RoleTemplate} from 'src/app/shared/models/api/Role';


@Injectable({
  providedIn: 'root'
})
export class AddParticipantService extends BaseService {

  constructor(private httpService: HttpService, private translationService: TranslationService) {
    super();
  }

  async getRoles(projectId: string): Promise<RoleTemplate[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append(`projectId`, projectId);
    return this.httpService.get("/users/assignableRoles?" + queryParams.toString(), null);
  }

  async getItemsForAutocomplete(query: any): Promise<DataAndTotalCountResult<any>> {
    var companyId = (!query || !query.companyId) ? null : query.companyId;
    var path = (!query) ? null : "/groups/" + companyId + "/roles";
    let requestData = {};
    var fullUrl: string = this.getWithQueryParameters(path, query);
    fullUrl = (!query || !query.projectId) ? fullUrl : (fullUrl + "&excludeProjectId=" + query.projectId);
    return this.httpService.get(fullUrl, requestData);
  }

  // async addParticipants(requestBody: any): Promise<any> {
  //   return this.httpService.post("/users/invite", requestBody);
  // }

  async addParticipants(items: AutocompleteItems[], roleTeplateId: string, targetId: string): Promise<any> {
    let requestBody = [];
    items.forEach(element => {
      requestBody.push({ "roleTemplateId": roleTeplateId, "userId": element.id, "targetId": targetId });
    });
    return this.httpService.post("/users/roles", requestBody);
  }

}
