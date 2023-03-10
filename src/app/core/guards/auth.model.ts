import {Role} from 'src/app/shared/models/api/Role'

export enum ERole {
    admin = 1,
    user = 2,
    guest = 4,
}

export class User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: ERole;
    token?: string;
    refreshToken?: string;
    emailVerified?: boolean;
    exchangeId?: number;
    gender?: string;
    jobTitle?: string;
    language?: string;
    lastLogin?: string;
    lastLogout?: string;
    lastTosAccepted?: boolean
    name?: string;
    salutation?: string;
    title?: string;
    trade?: string;
    roles?:Role[]
}

export enum EDialogType {
    relogin,
    noacces
}


