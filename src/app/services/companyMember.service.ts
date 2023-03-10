import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpService } from '../core/services/http.service';
import { DataAndTotalCountResult, IDataAndTotalCountResultTemplate } from '@shared/models/api/DataAndTotalCountResult';
import { IDataAndTotalCountService } from '@shared/models/IDataAndTotalCountService';
import { ERoles, Role } from '@shared/models/api/Role';
import { CompanyMember } from '@shared/models/api/tableDataType';
import { TranslationService } from '../core/services/translation.service';



@Injectable({
  providedIn: 'root'
})
export class CompanyMemberService extends BaseService implements IDataAndTotalCountService<IDataAndTotalCountResultTemplate> {

  constructor(private httpService: HttpService, private translationService: TranslationService) { super() }

  async getData(query: any): Promise<DataAndTotalCountResult<CompanyMember>> {
    var companyId = (!query || !query.companyId) ? null : query.companyId;
    var path = (!query) ? null : "/groups/" + companyId + "/roles";
    var fullUrl: string = this.getWithQueryParameters(path, query);
    let requestData = {};
    return this.httpService.get(fullUrl, requestData)
      .then(
        //response 200
        (res: DataAndTotalCountResult<Role>) => {
          let result = new DataAndTotalCountResult<CompanyMember>();
          result.total = res.total;
          res.data.forEach(el => {
            let member:CompanyMember = el.user as CompanyMember;  
            member.verified=member.emailVerified; 
            member.mail=member.email;        
            member.roleTemplateId = el.role.id;
            member.currentProjects = el.projects,
            member.nmbCurrentProjects= el.projects?el.projects.length:0;
            member.role = this.selectCompanyRole(el.role.assignedRole);
            member.class = this.selectIconForCompanyRole(el.role.assignedRole);
            result.data.push(member);
          });
          return result;

        },
        // not 200
        err => {
          return err;
        }
      );
  }

  selectIconForCompanyRole(role: string) {
    switch (role) {
      case ERoles.employee:
        return "custom-employee";
      case ERoles.guest:
        return "custom-guest";
      case ERoles.administrator:
        return "custom-administrator";
      default:
        throw new Error("role not included");
    }
  }

  selectCompanyRole(role: string) {
    let res = "";
    switch (role) {
      case ERoles.employee:
        res = 'employee';
        break;
      case ERoles.guest:
        res = 'guest';
        break;
      case ERoles.administrator:
        res = 'administrator';
        break;
      default:
        throw new Error("role not included");
    }
    return this.translationService.translate(res);
  }

}



