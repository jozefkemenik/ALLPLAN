import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectDocumentsService } from 'src/app/services/projectDocuments.service';
import { BreadcrumbsService } from '../../../../features/breadcrumbs/breadcrumbs.service'
import { ReportService } from 'src/app/services/report.service';
import { throwError } from 'rxjs';
import { SimpleDropDown } from '@shared/models/simpleDialog';
import { DeleteDocumentsDialogProvider } from './tabs/documents/dialogs/delete/delete.component';
import { TranslationService } from 'src/app/core/services/translation.service';
import { HttpService } from 'src/app/core/services/http.service';
import { ProjectDocument } from '@shared/models/api/ProjectDocument';
import { TableProvider } from '@shared/components/table/table.component';
import { AlertService } from 'src/app/services/alert.service';
import { AddParticipantDialogProvider } from './tabs/participants/dialogs/add-participant/add-participant.component';
import { ProjectService } from 'src/app/services/project.service';
import {
  ProjectWithRole,
  RoleTemplate,
  EOperationProjectEditor,
  EOperationProjectManager
} from '@shared/models/api/Role';
import { ETableAction } from '@shared/components/table/models/TableAction.model';
import { SelectRecipientsDialogProvider } from './tabs/documents/dialogs/select-recipients/select-recipients.component';
import { AuthService } from 'src/app/core/guards/auth.service';

@Component({
  selector: 'ap-projectPageDetail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetailComponent implements OnInit {
  responseData: Map<string, string>;
  searchTermObj: Object = {};
  searchValue: string;
  searchDisable: boolean = false;
  selectedTabIndex: number = 0;
  projectId: string;
  companyId: string;

  selectionTableData: any[] = [];
  dropDownItems: SimpleDropDown[];

  //spinner button config
  isLoading: boolean;

  currentUserProjectRoles: ProjectWithRole; //all project roles of current loged in user
  isLoadingRoles: boolean = false;

  constructor(
    private httpService: HttpService,
    private router: Router,
    protected projectDocService: ProjectDocumentsService,
    private tableProvider: TableProvider,
    public bs: BreadcrumbsService,
    private reportService: ReportService,
    public deleteDialogProvider: DeleteDocumentsDialogProvider,
    private ts: TranslationService,
    private alertService: AlertService,
    public addParticipantDialogProvider: AddParticipantDialogProvider,
    private as: AuthService,
    private projectService: ProjectService,
    private selectRecipientsDialogProvider: SelectRecipientsDialogProvider) {

    this.bs.subscribeUpdateBreacrumbs(() => {
      this.companyId = this.bs.params["_idCompany"];
      this.projectId = this.bs.params["_idProject"];
    })
    this.searchValue = "";
    this.dropDownItems = [
      { value: "button_download", icon: "custom-download-icon", disabled: true },
      { value: "button_send", icon: "custom-send", disabled: true },
      { value: "button_delete", icon: "custom-delete-project-icon", disabled: true }];
    this.isLoading = false;
  }

  ngOnInit() {
    this.selectedTabIndex = this.httpService.getTabIndex();
    this.setRoles();
  }

  doSearch() {
    this.searchTermObj[this.selectedTabIndex] = this.searchValue;
  }

  closeSearch() {
    this.searchTermObj[this.selectedTabIndex] = null;
    this.searchValue = null;
  }



  onTabChanged($event) {
    this.selectedTabIndex = $event.index;
    this.searchValue = this.searchTermObj[this.selectedTabIndex];
    this.httpService.setTabIndex($event.index);
  }

  //get all data from rows which are selected in table component
  getSelectionOutputData(outputDataFromChild: any) {
    this.selectionTableData = outputDataFromChild;
    this.dropDownItems[0].disabled = (this.selectionTableData?.length > 0) ? false : true; //download
    this.dropDownItems[1].disabled = (this.selectionTableData?.length > 0 && this.currentUserProjectRoles && RoleTemplate.load(this.currentUserProjectRoles.role).hasOperation(EOperationProjectEditor.Document_Assign)) ? false : true; //send 
    this.dropDownItems[2].disabled = (this.selectionTableData?.length > 0) ? false : true; //delete
  }

  multipleDownloads() {
    this.downloadFiles();
  }

  private async downloadFiles() {
    let queryParams = new HttpParams();

    this.selectionTableData.forEach(value => {
      queryParams = queryParams.append(`id`, value.id);
    });

    await this.projectDocService.revisionDownload(queryParams, this.selectionTableData[0].fileName).then((json: any) => {
      let actualDate = formatDate(new Date(), 'dd.MM.yyyy - hh:mm:ss', 'en');
      if (json.class == "svg-mat-icon-visited") {
        this.selectionTableData.forEach(value => {
          //check if some id is excluded first
          let isExcluded = false;
          if (json.excluded.length > 0) {
            isExcluded = json.excluded.find((o, i) => {
              if (o === value.revisionId) return true;
            });
          }
          //find download action 
          value.actions.find((o, i) => {
            if (o.name === ETableAction.DOWNLOAD && !isExcluded) {
              value.actions[i].tooltip = actualDate;
              value.actions[i].class = json.class;
              return true; // stop searching
            }
          });
        });
      }
    });
  }

  projectDocumentReport() {
    this.isLoading = true;
    this.reportService.downloadReport(this.projectId).then(
      html => {
        let winUrl = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
        window.open(winUrl);
        this.isLoading = true;
      }, err => {
        this.alertService.error(this.ts.translate('failedToGetReport'), '', null, 5000);
      }).finally(() => {
        this.isLoading = false;
      });
  }


  getOutput(emitValue: any) {
    switch (emitValue) {
      case "button_download":
        this.multipleDownloads();
        //todo later
        break;
      case "button_send":
        let recipientsData = { projectId: this.projectId, revisions: this.selectionTableData, companyId: this.companyId };
        this.selectRecipientsDialogProvider.open(recipientsData).then(
          resp => {
            if (resp) {
              // this triggers LOAD methd on table instance
              //this.tableProvider.refresh('project-documents');
            }
          }
          , err => {
          })

        //this.tableProvider.refresh('project-documents');
        //todo later
        break;
      case "button_delete":
        let data = {
          selected: this.selectionTableData as ProjectDocument[]
        };
        //error toast message
        ///todo refresh table
        this.deleteDialogProvider.open(data).then(
          resp => {
            if (resp) {
              // this triggers LOAD methd on table instance
              this.tableProvider.refresh('project-documents');
            }
          }
          , err => {
          })
        break;
      default:
        throwError(emitValue + " action is not ssupported");
        break;
    }
  }

  addParticipant(event: MouseEvent) {
    const target = new ElementRef(event.currentTarget);
    //console.log(event.target.getBoundingClientRect());
    let data = { projectId: this.projectId, companyId: this.companyId, trigger: target, email: this.as.currentUser.email };
    this.addParticipantDialogProvider.open(data).then(
      resp => {
        if (resp !== "cancel") {
          this.tableProvider.refresh('project-participants');
        }
      }
      , err => {
      });
  }

  get addButtonDisabled() {
    return !this.currentUserProjectRoles || !RoleTemplate.load(this.currentUserProjectRoles.role).hasOperation(EOperationProjectManager.ProjectUser_Assign);
  }

  get reportDisabled() {
    return !this.currentUserProjectRoles || !RoleTemplate.load(this.currentUserProjectRoles.role).hasOperation(EOperationProjectEditor.Report_AssignAndDownload);
  }

  get participantDisabled() {
    return !this.currentUserProjectRoles || !RoleTemplate.load(this.currentUserProjectRoles.role).hasOperation(EOperationProjectEditor.ProjectUser_Read);
  }

  setRoles() {
    this.isLoadingRoles = true;
    this.projectService.getProjectRoles(this.projectId, this.as.currentUser.email).then(
      resp => {
        this.currentUserProjectRoles = resp;
      },
      err => {
      }
    ).finally(() => {
      this.isLoadingRoles = false;
    });
  }

  iconIsDisabled() {
    return !RoleTemplate.load(this.currentUserProjectRoles.role).hasOperation(EOperationProjectManager.ProjectUser_Assign);
  }

}

