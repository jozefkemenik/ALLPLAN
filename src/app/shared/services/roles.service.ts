import { Injectable } from '@angular/core';
import { promise } from 'protractor';
import { HttpService } from 'src/app/core/services/http.service';
import { Role, RoleTemplate, EResourceType, ERoles } from '../models/api/Role';
import { AuthService } from 'src/app/core/guards/auth.service';



@Injectable({
    providedIn: 'root'
})
export class RolesService { 
    constructor(private http: HttpService, private as: AuthService) { }

    get currentUserRoles():Role[]{
        return this.as.currentUser.roles;
    }
    getCurrentUserRolesByCompanyId(id:string):RoleTemplate{
        return RoleTemplate.load(this.currentUserRoles.find(r=>r.targetId==id && r.role.type== EResourceType.Team )?.role);
    }
    getCurrentUserRolesByProjectId(id:string):RoleTemplate{
        return RoleTemplate.load(this.currentUserRoles.find(r=>r.targetId==id && r.role.type== EResourceType.Project)?.role);
    }

    getRolesByCompanyId(id:string):Promise<RoleTemplate[]>{
            return this.http.get("/users/assignableRoles", {teamId:id});      
    }

    getRolesByProjectId (id:string):Promise<RoleTemplate[]>{
        return this.http.get("/users/assignableRoles", {projectId:id});
    }
    updateUserRoles (userId:string,targetId:string, roleTemplateId:string):Promise<any>{
        return this.http.post("/users/roles", [{targetId:targetId,userId:userId, roleTemplateId:roleTemplateId}]);
    }
}
