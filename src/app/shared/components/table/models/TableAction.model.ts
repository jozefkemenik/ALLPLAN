export enum ETableAction {
  DELETE = "google_icons_delete",
  REFRESH = "google_icons_refresh",
  DATA_RECEIVED = "data_received", //icon not exist
  CUSTOM = "custom", //icon not exist
  EXPAND_ROW = "expand_row", //icon not exist
  ROW_CLICKED = "row_clicked", //icon not exist
  LINK_CLICKED = "link_clicked", //icon not exist
  DOWNLOAD = "download",
  SELECTION= "selection",
  ACTIONS= "action"
}

export class PayLoad {
  pageIndex: number = 0;
  pageSize: number = 0;
  searchTerm?:string= null;
  sortingConfig:Array<any> = [];
  getWithQueryParameters(baseUrlString: string) {
    const search: string = this.searchTerm ? `?searchTerm=${encodeURIComponent(this.searchTerm)}&` : "?";
    const sort = this.sortingConfig ?.length > 0 ? `sortBy=${this.sortingConfig.join()}&` : "";
    return `${baseUrlString}${search}${sort}pageStart=${this.pageIndex * this.pageSize}&pageSize=${this.pageSize}`;
  }
}

export class TableAction {
  constructor(tb:ETableAction = ETableAction.REFRESH, pl:PayLoad = new PayLoad()){
    this.eTableAction = tb;
    this.payLoad = pl
  }
  eTableAction: ETableAction;
  payLoad?: PayLoad;
  data?: any
}

