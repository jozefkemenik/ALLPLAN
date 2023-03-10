import * as internal from 'stream';
import { RoleTemplate } from './Role'
import { User } from './User'

export class CompanyMember extends User  {
    currentProjects: string[]; //from array to one string split by ,
    role: string;
    roleTemplateId: string;
    class?: string;
    mail:string;
    verified: boolean;
    nmbCurrentProjects?:number
}

export class Participants extends User {
    mail?: string;
    projectRole: string;
    projectRoleId: string;
    class?: string;
    verified: boolean;
    role: RoleTemplate;
}

