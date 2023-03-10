import {Role} from 'src/app/shared/models/api/Role'


export class User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
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


