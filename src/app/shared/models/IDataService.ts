import { Observable } from 'rxjs';

export interface IDataService {
    getData(query: any): Observable<ResultWrapper>;
}

export class Action {
    targetType: string;
    targetId: string;
    actionName: string;
}

export class ResultWrapper {
    data: any[];
    total: number;
}