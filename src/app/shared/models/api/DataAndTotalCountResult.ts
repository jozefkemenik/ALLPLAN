export interface IDataAndTotalCountResultTemplate {
}

export class DataAndTotalCountResult<T> implements IDataAndTotalCountResultTemplate {
    data: T[] = [];
    total: number;
}


