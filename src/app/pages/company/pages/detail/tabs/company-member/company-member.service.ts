import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http.service';
import { Reinvite } from '../../detail.component';

@Injectable({
  providedIn: 'root'
})
export class CompanyMemberService {

  constructor(private httpService: HttpService, private http: HttpClient) { }

  async excludeMember(userIds: Array<string>, companyId: string): Promise<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append(`groupId`, companyId);

    for (let userId of userIds) {
      queryParams = queryParams.append('userId', userId);
    }
    return this.httpService.delete('/users/roles?' + queryParams.toString(), {});
  }

  // async reinviteUsers(reinviteData: Reinvite): Promise<any> {
  //   this.httpService.post('users/invite', reinviteData).catch(error => {
  //     console.log("TTxx err", error);
  //   });
  // }

  async reinviteUsers(reinviteData: Reinvite): Promise<any> {
    return this.httpService.post('users/invite', reinviteData);
  }

}
