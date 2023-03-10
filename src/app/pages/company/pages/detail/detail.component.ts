import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BreadcrumbsService } from 'src/app/features/breadcrumbs/breadcrumbs.service';
import { HttpService } from 'src/app/core/services/http.service';

import { RolesService } from 'src/app/shared/services/roles.service';
import { DialogAddMemberProvider } from './dialogs/dialog-addmember.component';
import { EOperationCompanyEmployee, EOperationCompanyAdministrator, EOperationProjectManager, RoleTemplate } from '@shared/models/api/Role';
import { TableProvider } from '@shared/components/table/table.component';
import { SimpleDropDown } from '@shared/models/simpleDialog';
import { forkJoin, throwError } from 'rxjs';
import { CompanyMember } from '@shared/models/api/tableDataType';
import { CompanyMemberService } from './tabs/company-member/company-member.service';
import { AlertService } from 'src/app/services/alert.service';
import { ExcludeMemberDialogProvider } from './tabs/company-member/dialogs/exclude-member/exclude-member.component';
import { TranslationService } from 'src/app/core/services/translation.service';
import { HttpErrorResponse } from '@angular/common/http';

export class Reinvite {
  emails: Array<string>;
  roleTemplateId: string;
  targetId: string
}

@Component({
  selector: 'ap-company-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetailComponent implements OnInit {

  companyId: string;
  selectedTabIndex: number = 0;
  disableAddButton: boolean = false;
  companyInfoDisabled: boolean = false;
  companyMemberDisabled: boolean;
  companyInfoExcludeMemberDisabled: boolean = false;
  dropDownItems: SimpleDropDown[];
  companymemberDisabled: boolean = false;
  selectionTableData: Array<CompanyMember> = [];
  isLoading: boolean = false;
  dialogResponse: boolean = false;

  reinviteUserLoading: boolean = false;
  companyMemberReinviteDisabled: boolean = true;

  constructor(private bs: BreadcrumbsService,
    private rs: RolesService,
    private dialogAdd: DialogAddMemberProvider,
    private httpService: HttpService,
    private tb: TableProvider,
    public excludeMemberDialogProvider: ExcludeMemberDialogProvider,
    private tableProvider: TableProvider,
    private ts: TranslationService,
    private as: AlertService,
    private companyMemberService: CompanyMemberService
  ) {
    this.dropDownItems = [
      { value: "exclude", icon: "custom-cancel-participation", disabled: true },
      { value: "reinvite", icon: "custom-reinvite", disabled: true }
    ];
  }

  ngOnInit() {
    this.companyId = this.bs.params["_idCompany"];
    this.selectedTabIndex = this.httpService.getTabIndex();
    this.checkUserRole();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.dropDownItems[0].disabled = this.companyInfoExcludeMemberDisabled || (this.selectionTableData.length < 1);
    this.dropDownItems[1].disabled = this.companyMemberReinviteDisabled || (this.selectionTableData.length < 1);
  }
  /**
   * 
   * @param $event 
   */
  onTabChanged($event) {
    this.httpService.setTabIndex($event.index);
  }
  /**
   *  
   */
  addMemberDialog() {
    this.dialogAdd.open({ companyId: this.companyId }).then((isCancel) => {
      if (!isCancel) {
        this.tb.refresh('company-detail-company-member');
        //call toast message
      }
    })
  }

  private checkUserRole() {
    this.disableAddButton = !this.rs.getCurrentUserRolesByCompanyId(this.companyId).hasOperation(EOperationCompanyAdministrator.TeamUser_Assign);
    this.companyInfoDisabled = !this.rs.getCurrentUserRolesByCompanyId(this.companyId).hasOperation(EOperationCompanyEmployee.Team_Read);
    this.companyInfoExcludeMemberDisabled = !this.rs.getCurrentUserRolesByCompanyId(this.companyId).hasOperation(EOperationCompanyAdministrator.TeamUser_Assign);
    this.companyMemberDisabled = !this.rs.getCurrentUserRolesByCompanyId(this.companyId).hasOperation(EOperationCompanyEmployee.TeamUser_Read);
    this.companyMemberReinviteDisabled = !this.rs.getCurrentUserRolesByCompanyId(this.companyId).hasOperation(EOperationCompanyAdministrator.TeamUser_Assign);
  }

  iconIsDisabled() {
    return !this.rs.getCurrentUserRolesByCompanyId(this.companyId).hasOperation(EOperationCompanyAdministrator.TeamUser_Assign);
  }

  getOutput(emitValue: any) {
    switch (emitValue) {
      case "exclude":
        this.openDialogExcludeMembers();
        break;
      case "reinvite":
        //todo in future
        this.reinviteUsers();
        break;
      default:
        throwError(emitValue + " action is not supported");
        break;
    }
  }

  //get all data from rows which are selected in table component
  getSelectionOutputData(outputDataFromChild: any) {
    this.selectionTableData = outputDataFromChild;
    this.dropDownItems[0].disabled = this.companyInfoExcludeMemberDisabled || (this.selectionTableData.length < 1);
    this.dropDownItems[1].disabled = this.companyMemberReinviteDisabled || (this.selectionTableData.length < 1) || this.containsVerifiedUsers();
  }

  openDialogExcludeMembers() {
    let userIds = [];
    for (let item of this.selectionTableData) {
      userIds.push(item.id);
    }

    this.excludeMemberDialogProvider.open({ userIds: userIds, companyId: this.companyId, name: this.ts.translate("selectedMembers") }).then(
      resp => {
        if (resp) {
          // this triggers LOAD methd on table instance
          this.tableProvider.refresh('company-detail-company-member');
        }
      }
      , err => {
      })
  }

  reinviteUsers() {
    this.reinviteUserLoading = true;
    let promises = [];
    let res = this.createReinviteRequestData();

    res.forEach(item => {
      promises.push(this.companyMemberService.reinviteUsers(item).catch(err => {
        return err; //this error is then catch in promise.All in responses as HttpErrorResponse
      }));
    });

    const allPromise = Promise.all(promises);

    allPromise.then(responses => {
      responses;
      responses.forEach(response => {
        if (response instanceof HttpErrorResponse) {
          this.as.error(this.ts.translate('invitationFailed'), '', null, 10000);
        } else {
          this.as.success(this.ts.translate('invitationSuccess'), '', null, 5000);
        }
      });
    }, (err) => {
      this.as.success(this.ts.translate('invitationSuccess'), '', null, 5000);
    }).catch(error => {
      this.as.error(this.ts.translate('invitationFailed'), '', null, 10000);
    });
  }

  containsVerifiedUsers(): boolean {
    for (let item of this.selectionTableData) {
      if (item.verified) return true;
    }
    return false;
  }

  createReinviteRequestData(): Map<string, Reinvite> {
    let dict: Map<string, Reinvite> = new Map<string, Reinvite>();

    this.selectionTableData.map(item => {
      if (dict.has(item.roleTemplateId)) {
        let items = dict.get(item.roleTemplateId);
        items.emails.push(item.mail);
      } else {
        let items = new Reinvite();
        items.emails = [];
        items.emails.push(item.mail);
        items.targetId = this.companyId;
        items.roleTemplateId = item.roleTemplateId;
        dict.set(item.roleTemplateId, items);
      }
    });
    return dict;
  }

}
