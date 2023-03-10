import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http.service';
import { User } from 'src/app/shared/models/api/User';
import { Role, EResourceType } from 'src/app/shared/models/api/Role';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpService) { }
    getUserCompanyRoles(id: string): Promise<User> {
        return this.http.get('users/' + id + '/assignedRoles', null).then((roles) => {
            var user = new User();
            user.id = id;
            user.roles = roles ? (roles as Role[]).filter(r => r.role.type == EResourceType.Team) : null;
            return user;
        },
            (err) => { throw err; });
    }
    getUserProjectRoles(id: string): Promise<User> {
        return this.http.get('users/' + id + '/assignedRoles', null).then((roles) => {
            var user = new User();
            user.id = id;
            user.roles = roles ? (roles as Role[]).filter(r => r.role.type == EResourceType.Project) : null;
            return user;
        },
            (err) => { throw err; });
    }
}
