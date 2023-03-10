export class BaseService {

    constructor() { }

    protected getWithQueryParameters(baseUrlString: string, query: any) {
        var pageIndex: number = query.pageIndex ?? 0;
        var pageSize: number = query.pageSize ?? 0;
        var search: string = query.searchTerm ? `?searchTerm=${encodeURIComponent(query.searchTerm)}&` : "?";
        var sort = query.sortingConfig?.length > 0 ? `sortBy=${query.sortingConfig.join()}&` : "";
        return `${baseUrlString}${search}${sort}pageStart=${pageIndex * pageSize}&pageSize=${pageSize}`;
    }

}
