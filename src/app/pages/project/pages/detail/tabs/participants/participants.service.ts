import { HttpParams } from '@angular/common/http';
import { ParseError } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { DataAndTotalCountResult, IDataAndTotalCountResultTemplate } from '@shared/models/api/DataAndTotalCountResult';
import { ERoles, ProjectWithRole } from '@shared/models/api/Role';
import { Participants } from '@shared/models/api/tableDataType';
import { IDataAndTotalCountService } from '@shared/models/IDataAndTotalCountService';
import { HttpService } from 'src/app/core/services/http.service';
import { TranslationService } from 'src/app/core/services/translation.service';
import { BaseService } from 'src/app/services/base.service';
import { CompanyMemberService } from 'src/app/services/companyMember.service';
import { RoleTemplate } from 'src/app/shared/models/api/Role';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService extends BaseService implements IDataAndTotalCountService<IDataAndTotalCountResultTemplate> {
 
  constructor(private httpService: HttpService, private _companyService: CompanyMemberService, private translationService: TranslationService) { super() }

  async getData(query: any): Promise<DataAndTotalCountResult<any>> {
    var projectId = (!query || !query.projectId) ? null : query.projectId;
    var path = (!query) ? null : "/projects/" + projectId + "/roles";
    let requestData = {};
    var fullUrl: string = this.getWithQueryParameters(path, query);
    return this.httpService.get(fullUrl, requestData)
      .then(
        //response 200
        (res: DataAndTotalCountResult<ProjectWithRole>) => {
          let result = new DataAndTotalCountResult<Participants>();
          result.total = res.total;
          res.data.forEach(el => {
            let participant:Participants = <Participants>el.user;
            participant.id = el.user.id;
            participant.mail = el.user.email;
            participant.verified = el.user.emailVerified;
            participant.role=RoleTemplate.load(el.role);
            participant.projectRole = this.translationService.translate(participant.role.tAssignedRole);
            participant.projectRoleId = participant.role.id;
            participant.class = this.selectIconForProjectRole(el.role.assignedRole);
            result.data.push(participant);
          });
          return result;
        },
        // not 200
        err => {
          return err;
        }
      );
  }

  async getParticipantDetail(userId: string): Promise<any> {
    return
    return this.httpService.get('/users/' + userId, null);
  }

  selectIconForProjectRole(role: string) {
    switch (role) {
      case ERoles.manager:
        return "custom-managers"; //3 icons in background
      case ERoles.editor:
        return "custom-editors"; //3 icons in background
      case ERoles.viewer:
        return "custom-viewers"; //3 icons in background
      default:
        throw new Error("role not included");
    }
  }



  async excludeParticipant(userId: string, projectId: string): Promise<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append(`userId`, userId);
    queryParams = queryParams.append(`projectId`, projectId);    
    return this.httpService.delete('/users/roles?' + queryParams.toString(), {});
  }

}
