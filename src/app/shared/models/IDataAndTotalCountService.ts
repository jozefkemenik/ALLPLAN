import { DataAndTotalCountResult } from "./api/DataAndTotalCountResult";

export interface IDataAndTotalCountService<T> {
    getData(query: any): Promise<DataAndTotalCountResult<T>>;
}