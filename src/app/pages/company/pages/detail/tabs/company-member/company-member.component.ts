import { Component, EventEmitter, Input, ViewEncapsulation, OnInit, Output } from '@angular/core';
import { CompanyMemberService } from 'src/app/services/companyMember.service';
import { DataAndTotalCountResult } from '@shared/models/api/DataAndTotalCountResult';
import { ITableConfig, EColumnConfigType } from '@shared/components/table/models/TableConfig.model';
import { ETableAction, TableAction, PayLoad } from '@shared/components/table/models/TableAction.model';
import { ExcludeMemberDialogProvider } from './dialogs/exclude-member/exclude-member.component';
import { TableProvider } from '@shared/components/table/table.component';
import { EmptyTable } from '@shared/components/empty-section/empty-section.component';
import {UserService} from 'src/app/shared/services/user.service';
import {EOperationCompanyAdministrator} from 'src/app/shared/models/api/Role';
import {RolesService} from 'src/app/shared/services/roles.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/core/guards/auth.service';

@Component({
  selector: 'ap-company-detail-company-member',
  templateUrl: './company-member.component.html',
  styleUrls: ['./company-member.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CompanyMemberComponent implements OnInit {
  /** table part */
  dataTable: DataAndTotalCountResult<any>;
  tableConfig: ITableConfig;
  isOpenSidebar:boolean=false;
  /** end table part */

  @Output() getSelectionOutput = new EventEmitter<any[]>(); //to parent get information of every change on checked row/rows in table component

  @Input() companyId: string;
  @Input() disabled: boolean;

  @Input() iconDisabled: boolean | undefined;

  config: EmptyTable = new EmptyTable();

  currentUserUnverified: boolean;

  //#region sidebar
  sidebarData: any;
  isEdit=false;
  canEdit=false;
  private pendingRoleChange = { text: "", value: "" };
  dataLoading = false;
  //#region 

  constructor(
    protected companyMemberService: CompanyMemberService,
    public excludeMemberDialogProvider: ExcludeMemberDialogProvider,
    private tableProvider: TableProvider,
    private as: AuthService,
    private us:UserService,
    private als: AlertService,
    private rs:RolesService) {

    this.config.textOne = "accessDenied";
    this.config.textTwo = "accessDeniedMessage";
    this.config.icon = null;
    this.config.img = 'assets/images/lock.svg';
    this.config.learnMore = null;
    this.config.url = null;


    this.currentUserUnverified = !(this.as.currentUser.emailVerified ? true : false);
  }

  ngOnInit() {
    this.initTableConfig();
    this.canEdit = this.rs.getCurrentUserRolesByCompanyId(this.companyId).hasOperation(EOperationCompanyAdministrator.TeamUser_Assign);
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
          this.excludeMemberDialogProvider.open({ userIds: [action.data.row.id], companyId: this.companyId, name: action.data.row.name }).then(
            resp => {
              if (resp) {
                // this triggers LOAD methd on table instance
                this.tableProvider.refresh('company-detail-company-member');
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


  /**
  * 
  * @param pl 
  */
  private load(pl: PayLoad) {
    pl['companyId'] = this.companyId;
    this.companyMemberService.getData(pl).then((res) => {
      this.dataTable = res;
      this.addActionsForRow(res.data);
    });
  }

  getTableSelectionOutput(outputChildData: any) {
    this.getSelectionOutput.emit(outputChildData);
  }

  protected initTableConfig() {
    this.tableConfig = {
      tableContext: "company-detail-company-member",
      tableInstance: "inbox",
      pageSizeOptions: [5, 20, 50],
      pageSizeIndex: 1,
      hasAction: true,
      //noActive: row => !row.verified,
      sort: { key: "name", direction: "asc" },
      emptyTable: {
        textOne: 'emptyProjectDocument1',
        textTwo: 'emptyProjectDocument2',
      },
      confColumns: [{
        key: 'name',
        header: 'name',
        type: EColumnConfigType.Str,
        initialWidth: '30%',
        sticky: true,   
        isLink: true,    
      },
      {
        key: 'keyword',
        header: 'keyword',
        type: EColumnConfigType.Str,
        initialWidth: '15%',
        show: false,
        inactive: "verified",
      }, {
        key: 'mail',
        header: 'mail',
        type: EColumnConfigType.Str,
        initialWidth: '15%',
        inactive: "verified",  
      }, {
        key: 'nmbCurrentProjects',
        header: 'currentProjects',
        type: EColumnConfigType.ShortNumber,
        inactive: "verified",
        expandable:row=>row.nmbCurrentProjects>0,
        canSort:false
      }, {
        key: 'role',
        header: 'role',
        type: EColumnConfigType.Str,
        icon: true,
        initialWidth: 'auto',
        inactive: "verified",
      }
      ]
    };
  }

  //to data which we have add new data with actions which can be used on row and are seen in last column
  private addActionsForRow(rows: Array<any>) {
    rows.forEach(rowData => {
      rowData["actions"] =
        [{
          name: ETableAction.DELETE,
          tooltip: this.iconDisabled ? 'youDoNotHaveRightRoleForTheFunction' : "excludeMember",
          icon: "custom-cancel-participation",
          class: this.iconDisabled ? "" : "svg-mat-icon",
          disabled: this.iconDisabled
        }];
    });
  }

    /**
   * 
   * @param id 
   */
    private openLink(data: any) {
     
      this.isOpenSidebar = true;
      this.dataLoading = true;
      this.us.getUserProjectRoles(data.id).then(
        resp => {

          data.roles= resp.roles?resp.roles:[];
          this.sidebarData =data;
          this.isOpenSidebar = true;
        }
        , err => {
          console.log(err);
        }).finally(() => {
          this.dataLoading = false;
        });
    }


    save() {
      if (this.pendingRoleChange &&
        this.pendingRoleChange.value &&
        this.pendingRoleChange.value !== this.sidebarData.roleTemplateId) {
        this.dataLoading = true;
        this.rs.updateUserRoles(this.sidebarData.id, this.companyId, this.pendingRoleChange.value).then(() => {
          this.sidebarData.roleTemplateId = this.pendingRoleChange.value;
          this.sidebarData.role = this.pendingRoleChange.text;
          this.isEdit = false;
          this.als.success('roleManagement', 'roleChangeSuccess', null, 10000);
          this.tableProvider.refresh('company-detail-company-member');
        }, (err) => {
          this.als.error('roleManagement', 'roleChangeError', null, 10000);
        }).finally(() => {
          this.dataLoading = false;
        })
      }
      else {
        this.isEdit = false;
      }
    }
    onChange(e) {
      this.pendingRoleChange = e;
    }
}
