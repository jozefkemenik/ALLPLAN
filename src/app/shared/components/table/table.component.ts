import { Component, ViewChild, OnInit, TemplateRef, QueryList, ViewEncapsulation, AfterViewInit, Output, EventEmitter, Injectable, Input, HostListener, SimpleChanges } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfigService } from 'src/app/services/config.service';
import { DataAndTotalCountResult } from '@shared/models/api/DataAndTotalCountResult'
import { TranslationService } from 'src/app/core/services/translation.service';
import { TableAction, ETableAction, PayLoad } from './models/TableAction.model';
import { TableConfig, ColumnConfig } from './models/TableConfig.model';
import { Subject } from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'ap-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class TableComponent implements OnInit {
  public readonly ROW_SEL_COLUMN_NAME = "__row_selection_col_name__";
  public readonly ROW_ACTIONS_COLUMN_NAME = "__row_actions_col_name__";

  private _payLoad: PayLoad;
  selection: SelectionModel<any>;
  totalCount: number;
  isLoading: boolean = true;
  isResizing: boolean = false;
  tableIsReady: boolean = false;
  isExpandedRow=false;
  expandedElement:any;

  goTo: number;
  pageNumbers: number[];
  rows: Array<any> = [];
  rowIndexLinkOpen?: number

  //input for expandDetail template
  @Input() expandDetail?: TemplateRef<any>;

  @Input()
  set isOpenSidebar(val: boolean) {
    if (!val) {
      this.rowIndexLinkOpen = null;
    }
  }
  /** ------------- input config */
  @Input() public config: TableConfig
  /** ------------- input data */
  private _data: DataAndTotalCountResult<any>;
  @Input()
  set data(val: DataAndTotalCountResult<any>) {
    this._data = val;
    if (val) {
      this.totalCount = val.total;
      this.rows = val.data;
    }
    this.isLoading = false;
  }
  get data(): DataAndTotalCountResult<any> {
    return this._data;
  }
  /** ------------- input search */
  @Input()
  set search(val: string) {
    if (this._payLoad) {
      this._payLoad.searchTerm = val;
      this.refreshData();
    }
  }
  get search(): string {
    return this._payLoad.searchTerm;
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Output() action: EventEmitter<TableAction> = new EventEmitter();


  constructor(private configService: ConfigService, private ts: TranslationService, private tp: TableProvider) {
    this.selection = new SelectionModel(true);
  }

  ngOnInit() {
    //update config
    this.config.emptyTable.img = 'assets/images/empty_table.svg';
    var hideLearnMore = this.config.emptyTable.learnMore =='no';
    //make new instance to get columns
    this.config = new TableConfig(this.config, this.ts);
    this.config.emptyTable.learnMore =hideLearnMore?null:this.config.emptyTable.learnMore;
    this.updateTransl();
    this.makePayLoad();
    //set default sorting
    this.setSorting();
    //to be able refresh table based table context Index
    this.tp.subscribeRefresh(this.refreshData.bind(this), this.config.tableContext);

    //udpate translations on langauge change
    this.ts.change$.subscribe((r) => {
      this.updateTransl();
      this.refreshData();
      this.config = new TableConfig(this.config, this.ts);
    });
  }

  updateTransl() {
    //this.config.emptyTable.url = this.configService.getUrlConfig()["help_" + this.ts.language.icon];
  }

  clickOnLink(key: string, rowIndex: number) {
    this.rowIndexLinkOpen = rowIndex;
    let action = new TableAction(ETableAction.LINK_CLICKED);
    action.data = Object.assign(this.rows[rowIndex], { clickedProp: key });
    this.action.emit(action)
  }

  private makePayLoad() {
    if (!this._payLoad) this._payLoad = new PayLoad();
    this._payLoad.pageIndex = this.paginator.pageIndex;
    this._payLoad.pageSize = this.paginator.pageSize ?? this.config.pageSizeOptions[this.config.pageSizeIndex];
  }

  sortChange(event: any): void {
    this.setSorting(event.active, event.direction)
  }

  setSorting(key?: string, direction?: string) {
    this._payLoad.sortingConfig = [];
    if (direction) {
      key = direction === 'asc' ? `@${key}` : `-${key}`;
      this._payLoad.sortingConfig = [key];
      this.refreshData();
    }
    else {
      if (this.config.sort?.direction) {
        this.setSorting(this.config.sort.key, this.config.sort.direction);
      } else {
        this.refreshData();
      }
    }

  }

  private refreshData() {
    this.isLoading = true;
    this.rows = [];
    this.selection.clear();
    this.action.emit(new TableAction(ETableAction.REFRESH, this._payLoad))
  }

  getSortStyle(column: string) {
    if (this._payLoad.sortingConfig.length == 0 || this._payLoad.sortingConfig[0].substring(1) !== column) return '';
    return this._payLoad.sortingConfig[0].charAt(0) === '-' ? 'sort-icon-desc' : 'sort-icon-asc';
  }

  columnsToDisplay(): string[] {
    var cols = [];
    if (this.config.canSelectRows) {
      cols.push(this.ROW_SEL_COLUMN_NAME);
    }
    this.config.columns.filter(c => c.show).forEach(r => {
      cols.push(r.key);
    });
    if (this.config.hasAction) {
      cols.push(this.ROW_ACTIONS_COLUMN_NAME);
    }
    return cols;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.rows.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.rows.forEach(row => this.selection.select(row));

    var action = new TableAction(ETableAction.SELECTION);
    action.data = this.selection.selected
    this.action.emit(action);
  }

  tongleElement(element: any) {
    this.selection.toggle(element);
    var action = new TableAction(ETableAction.SELECTION);
    action.data = this.selection.selected
    this.action.emit(action);
  }




  paginationChange(pageEvt: PageEvent) {
    this.makePayLoad();
    this.refreshData();
  }

  isItemLastColumn(item: any) {
    return !(this.config.columns[this.config.columns.length - 1] === item);
  }

  clickAction(event: any, row: any, action) {
    if (!action.disabled) {
      var ta = new TableAction(ETableAction.ACTIONS);
      ta.data = { row: row, element: event.target, action: action };
      this.action.emit(ta);
    }
  }

  selectTableTextClass(item: ColumnConfig, element: any) {
    return item.icon ? ('table-icon ' + element.class) : '';
  }

  get expanableColumns():string[]{
    return this.config.columns.some(c=>c.expandable)?['expandedDetail']:[];
  }
}
/**
 * The refresh method triggers the load on table from anywhere
 * Table is identified by ID which is tableContext parameter from configuarion
 */
enum fnType {
  refresh,
  resetLink
}

@Injectable({ providedIn: 'root' })
export class TableProvider {

  private $subject: Subject<any> = new Subject();
  subscribeRefresh(fn: () => void, id: string) {
    this.$subject.subscribe(s => {
      if (s.id == id && s.fnType == fnType.refresh) fn();
    });
  }
  subscribeResetLink(fn: () => void, id: string) {
    this.$subject.subscribe(s => {
      if (s.id == id && s.fnType == fnType.resetLink) fn();
    });
  }
  refresh(id: string) {
    this.$subject.next({ id: id, fnType: fnType.refresh });
  }
  resetLink(id: string) {
    this.$subject.next({ id: id, fnType: fnType.resetLink });
  }
}

