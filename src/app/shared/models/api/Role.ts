import { User } from "./User";


export enum EOperationCompanyGuest{
    Team_ReadBasic ='Team_ReadBasic'
}

export  enum EOperationCompanyEmployee{
    Team_Read = 'Team_Read',
    TeamUser_Read ='TeamUser_Read'
}

export enum EOperationCompanyAdministrator{
    Team_Update=' Team_Update',
    TeamUser_Assign='TeamUser_Assign',
    Project_ReadAll='Project_ReadAll',
    Project_Create='Project_Create',
    Project_Update='Project_Update',
    Project_Delete='Project_Delete'
}

export enum EOperationProjectViewer{
    Document_ReadOwn='Document_ReadOwn',
    Project_ReadOwn='Project_ReadOwn'
}
export enum EOperationProjectEditor{
    Document_ReadAll='Document_ReadAll',
    Project_Update='Project_Update',
    ProjectUser_Read='ProjectUser_Read',
    Document_Assign='Document_Assign',
    Document_Delete='Document_Delete',
    Report_AssignAndDownload='Report_AssignAndDownload',
    FileRevisionDownload_Read='FileRevisionDownload_Read',
}
export enum EOperationProjectManager{
    ProjectUser_Assign='ProjectUser_Assign'
}



type ERoleOperations = EOperationCompanyEmployee
                      |EOperationCompanyGuest
                      |EOperationCompanyAdministrator
                      |EOperationProjectViewer
                      |EOperationProjectEditor
                      |EOperationProjectManager;




export class Role {
    role: RoleTemplate;
    targetName: string;
    targetId: string;
    user: User;
    projects?: string[]; //BE TeamWithRole.dto.cs
}

export class RoleTemplate {
    id: string;
    type: EResourceType;
    assignedRole: ERoles;
    allOperations: ERoleOperations[];
    inheritedRoles: ERoles[];
    hasOperation(ro:ERoleOperations):boolean{
        return this.allOperations.includes(ro);
    }
    static load(rt:RoleTemplate):RoleTemplate{
        return Object.assign(new RoleTemplate(),rt);  
    }
    get tAssignedRole():string{
        const indexOf = Object.values(ERoles).indexOf(this.assignedRole as unknown as ERoles);
        return Object.keys(ERoles)[indexOf];
    }
}

RoleTemplate.prototype

export enum EResourceType {
    Team = 1,
    Project = 2
}

export enum ERoles {
    guest = "Company Guest", //company role
    employee = "Company Employee", //company role
    administrator = "Company Administrator", //company role
    viewer = "Project Viewer", //project role
    editor = "Project Editor", //project role
    manager = "Project Manager" //project role
}



export class CadProject {
    guid: string;
    name: string;
}

export class ProjectWithRole extends Role {
    parentGroupId: string;
    canViewRoles: Boolean;
    cadProjects: CadProject[];
}
export class TeamWithRole extends Role {
    projects: Array<string>;
}