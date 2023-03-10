
import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ParticipantsService } from './participants.service';
import { DataAndTotalCountResult } from '@shared/models/api/DataAndTotalCountResult'
import { EColumnConfigType, ITableConfig } from '@shared/components/table/models/TableConfig.model';
import { ETableAction, PayLoad, TableAction } from '@shared/components/table/models/TableAction.model';
import { formatDate } from '@angular/common';
import { ExcludeParticipantDialogProvider } from './dialogs/exclude-participant/exclude-participant.component';
import { TableProvider } from '@shared/components/table/table.component';
;
import { RolesService } from 'src/app/shared/services/roles.service';
import { EOperationProjectManager } from '@shared/models/api/Role';
import { AlertService } from 'src/app/services/alert.service';
import { EmptyTable } from '@shared/components/empty-section/empty-section.component';
import { Observable, of, Subject } from 'rxjs';
import { concatMap } from 'rxjs/operators';




@Component({
  selector: 'ap-project-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ParticipantsComponent implements OnInit {
  /** table part */
  dataTable: DataAndTotalCountResult<any>;
  tableConfig: ITableConfig;
  isEdit = false;
  canEdit = false;
  /** end table part */


  @Input() projectId;
  @Input() search: string;
  @Output() getSelectionOutput = new EventEmitter<any[]>(); //to parent get information of every change on checked row/rows in table component

  searchTerm: string;

  sidebarData: any;
  isOpenSidebar = false;
  dataLoading = false;

  private pendingRoleChange = { text: "", value: "" }

  @Input() iconDisabled: boolean | undefined;

  @Input() disabled: boolean;
  config: EmptyTable = new EmptyTable();

  constructor(@Inject(LOCALE_ID) public locale: string,
    protected participantsService: ParticipantsService,
    protected commonService: CommonService,
    public excludeParticipantDialogProvider: ExcludeParticipantDialogProvider,
    private tableProvider: TableProvider,
    private rs: RolesService,
    private as: AlertService,
    private tb: TableProvider) {
    this.config.textOne = "accessDenied";
    this.config.textTwo = "accessDeniedMessage";
    this.config.icon = null;
    this.config.img = 'assets/images/lock.svg';
    this.config.learnMore = null;
    this.config.url = null;
  }

  ngOnInit(): void {
    this.initTableConfig();
    //this.canEdit = this.rs.getCurrentUserRolesByProjectId(this.projectId).hasOperation(EOperationProjectManager.ProjectUser_Assign);
  }

  /**
  * 
  * @param action 
  */
  onTableAction(action: TableAction) {
    switch (action.eTableAction) {
      case ETableAction.REFRESH:
        this.load(action.payLoad);
        break;
      case ETableAction.LINK_CLICKED:
        this.openLink(action.data);
        break;
      case ETableAction.ACTIONS:
        if (action.data.action.name === ETableAction.DELETE) {
          this.excludeParticipantDialogProvider.open({ userId: action.data.row.id, projectId: this.projectId, name: action.data.row.name }).then(
            resp => {
              if (resp) {
                // this triggers LOAD methd on table instance
                this.tableProvider.refresh('project-participants');
              }
            }
            , err => {
            })

        }
        break;
      case ETableAction.SELECTION:
        this.getSelectionOutput.emit(action.data);
        break;
    }
  }

  private load(pl: PayLoad) {
    pl['projectId'] = this.projectId;
    this.participantsService.getData(pl).then((res) => {
      this.addActionsForRow(res.data)
      this.dataTable = res;
    })
  }


  private initTableConfig() {
    // var localeDateFormat = this.commonService.getLocaleDateTimeFormat(this.locale);
    this.tableConfig = {
      tableContext: "project-participants",
      tableInstance: "inbox",
      pageSizeOptions: [5, 20, 50],
      pageSizeIndex: 1,
      hasAction: true,
      noActive: row => !row.verified,

      emptyTable: {
        textOne: 'emptyProjectDocument1',
        textTwo: 'emptyProjectDocument2'
      },
      confColumns: [{
        key: 'name',
        header: "name",
        type: EColumnConfigType.Str,
        initialWidth: '30%',
        maximalWidth: '500px',
        isLink: true,
      }, {
        key: 'mail',
        type: EColumnConfigType.Str,
        header: 'mail',
        initialWidth: '250px',
      }, {
        key: 'projectRole',
        type: EColumnConfigType.Str,
        header: 'role',
        icon: true
      }]
    };
  }

  private openLink(data: any) {
    this.isEdit = false;
    this.sidebarData = data;
    this.isOpenSidebar = true;
  }




  cancel() { }

  onChange(e) {
    this.pendingRoleChange = e;
  }


  save() {
    if (this.pendingRoleChange &&
      this.pendingRoleChange.value &&
      this.pendingRoleChange.value !== this.sidebarData.projectRoleId) {
      this.dataLoading = true;
      this.rs.updateUserRoles(this.sidebarData.id, this.projectId, this.pendingRoleChange.value).then(() => {
        this.sidebarData.projectRoleId = this.pendingRoleChange.value;
        this.sidebarData.projectRole = this.pendingRoleChange.text;
        this.isEdit = false;
        this.as.success('roleManagement', 'roleChangeSuccess', null, 10000);
        this.tb.refresh('project-participants');
      }, (err) => {
        this.as.error('roleManagement', 'roleChangeError', null, 10000);
      }).finally(() => {
        this.dataLoading = false;
      })
    }
    else {
      this.isEdit = false;
    }
  }

  // @Input() refreshDataOutput: boolean;

  @Input()
  public set refreshDataOutput(val: boolean) {
    if (val) {
      this.refreshDataAction();
    }
  }

  refreshDataAction() {
    //this.table.refreshTableData();
  }

  //to data which we have add new data with actions which can be used on row and are seen in last column
  private addActionsForRow(rows: Array<any>) {
    rows.forEach(rowData => {
      rowData["actions"] =
        [{
          name: ETableAction.DELETE,
          tooltip: this.iconDisabled ? 'youDoNotHaveRightRoleForTheFunction' : "excludeParticipant",
          icon: "custom-cancel-participation",
          class: this.iconDisabled ? "" : "svg-mat-icon",
          disabled: this.iconDisabled
        }];
    });
  }

}
