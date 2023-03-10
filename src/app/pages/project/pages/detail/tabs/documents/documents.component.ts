import { Component, EventEmitter, Input, OnInit, Output, ViewChild, TemplateRef } from '@angular/core';
import { of } from 'rxjs';
import { ProjectDocumentsService } from 'src/app/services/projectDocuments.service';
import { CommonService } from 'src/app/services/common.service';
import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ITemplateRefType } from '@shared/components/sidebar/sidebar.component';
import { BreadcrumbsService } from 'src/app/features/breadcrumbs/breadcrumbs.service';
import { Router } from '@angular/router';
import { ITableConfig, EColumnConfigType } from '@shared/components/table/models/TableConfig.model';
import { ETableAction, TableAction, PayLoad } from '@shared/components/table/models/TableAction.model';
import { DataAndTotalCountResult } from '@shared/models/api/DataAndTotalCountResult';
import { TableProvider } from 'src/app/shared/components/table/table.component'
import { AnyCnameRecord } from 'dns';

@Component({
  selector: 'ap-project-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class ProjectDocumentsComponent implements OnInit {

  /** sidebar part */
  @ViewChild('sidebarContentTab1', { static: true, read: TemplateRef }) tab1: TemplateRef<any>;
  @ViewChild('sidebarContentTab2', { static: true, read: TemplateRef }) tab2: TemplateRef<any>;
  @ViewChild('sidebarContentTab3', { static: true, read: TemplateRef }) tab3: TemplateRef<any>;
  @ViewChild('sidebarContentTab4', { static: true, read: TemplateRef }) tab4: TemplateRef<any>;
  isOpenSidebar = false;
  sidebarData: any;
  sidebarTemplateTabs: ITemplateRefType[];
  tabIndex = 0;
  /** end sidebar part */


  /** table part */
  dataTable: DataAndTotalCountResult<any>;
  tableConfig: ITableConfig;
  /** end table part */


  @Input() itemProjectId;
  @Input() search: string;
  @Output() getSelectionOutput = new EventEmitter<any[]>(); //to parent get information of every change on checked row/rows in table component

  dataLoading = false;
  private refreshDataOutputValue: boolean;

  constructor(

    protected projectDocService: ProjectDocumentsService,
    protected commonService: CommonService,
    private bs: BreadcrumbsService,
    private router: Router,
    private tp: TableProvider) { }

  ngOnInit() {
    //sidebar
    this.sidebarTemplateTabs = [
      { title: 'ProjectDocumentSideBarTabCurrentIndex', templateRef: this.tab1, context: "rPanelCurrentIndex", disabled: false, translation: 'youDoNotHaveRightRoleForTheFunction' },
      { title: 'ProjectDocumentSideBarTabTracking', templateRef: this.tab2, context: "rPanelTracking", translation: 'youDoNotHaveRightRoleForTheFunction' },
      { title: 'ProjectDocumentSideBarTabGeneral', templateRef: this.tab3, context: "rPanelGeneral", disabled: false, translation: 'youDoNotHaveRightRoleForTheFunction' }];

    this.initTableConfig();
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
        this.openLink(action.data.id);
        break;
      case ETableAction.ACTIONS:
        this.DownloadFile(action.data);
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
    pl['projectId'] = this.itemProjectId;
    this.projectDocService.getData(pl).then((res) => {
      this.addActionsForRow(res.data)
      this.dataTable = res;
    })
  }

  /**
   * 
   * @param id 
   */
  private openLink(id: string) {
    this.isOpenSidebar = true;
    this.dataLoading = true;
    this.projectDocService.getDocumentDetail(id).then(
      resp => {
        this.sidebarData = resp;
        this.isOpenSidebar = true;
        this.sidebarTemplateTabs[1].disabled = !resp.canTrackDownloads;
      }
      , err => {
        console.log(err);
      }).finally(() => {
        this.dataLoading = false;
      });
  }

  //TODO make this inside share files -> used in dashboard as well
  private async DownloadFile(val) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append(`id`, val.row.id);
    await this.projectDocService.revisionDownload(queryParams, val.row.fileName).then((data: any) => {
      if (data.class === "svg-mat-icon-visited") {
        let actualDate = formatDate(new Date(), 'dd.MM.yyyy - hh:mm:ss', 'en');
        val.action.tooltip = actualDate;
      }
      val.action.class = data.class;
    });
  }



  protected initTableConfig() {
    // var localeDateFormat = this.commonService.getLocaleDateTimeFormat(this.locale);
    this.tableConfig = {
      tableContext: "project-documents",
      tableInstance: "inbox",
      pageSizeOptions: [5, 20, 50],
      pageSizeIndex: 1,
      hasAction: true,
     // sort: { key: "layoutNumber", direction: "asc" },
      //we can define condition on whole row
      //noActive:row=>row.id=='f8a94cc8-8007-4fdf-a518-609849769c50',
      emptyTable: {
        textOne: 'emptyProjectDocument1',
        textTwo: 'emptyProjectDocument2',

      },
      confColumns: [{
        key: 'layoutNumber',
        type: EColumnConfigType.Str,
        header: 'No.',
        sticky: true,
        isLink: true,
      },
      {
        key: 'index',
        type: EColumnConfigType.Str,
        header: 'projectDocuments_index',
        sticky: true,
        isLink: true,
      },
      {
        key: 'layoutName',
        type: EColumnConfigType.Str,
        header: 'projectDocuments_layoutName',
        initialWidth: '15%',
        sticky: true,
        isLink: true,
      },
      {
        key: 'fileName',
        type: EColumnConfigType.Str,
        header: 'projectDocuments_fileName',
        initialWidth: '15%',
        minimalWidth: '20px',
        maximalWidth: '1500px',


      }, {
        key: 'hierarchicCode',
        type: EColumnConfigType.Str,
        header: 'projectDocuments_hierarchicCode',
      }, {
        key: 'layoutDescription',
        type: EColumnConfigType.Str,
        header: 'projectDocuments_layoutDescription',
      }, {
        key: 'layoutReviewedBy',
        type: EColumnConfigType.Str,
        header: 'projectDocuments_layoutReviewedBy',
      }, {
        key: 'layoutApprovalDate',
        type: EColumnConfigType.LongDate,
        header: 'projectDocuments_layoutApprovalDate',
      }, {
        key: 'fileType',
        type: EColumnConfigType.FileType,
        header: 'projectDocuments_fileType',
      }, {
        key: 'uploadDate',
        type: EColumnConfigType.LongDate,
        header: 'projectDocuments_uploadType',
      }, {
        key: 'uploadBy',
        type: EColumnConfigType.Str,
        header: 'projectDocuments_uploadBy',
        css: 'configurable-column-1',
        initialWidth: 'auto',
        maximalWidth: '500px',
      },
      ]
    };
  }



  //to data which we have add new data with actions which can be used on row and are seen in last column
  private addActionsForRow(rows: Array<any>) {
    rows.forEach(rowData => {
      rowData["actions"] =
        [{
          name: ETableAction.DOWNLOAD,
          tooltip: !rowData["downloadDate"] ? 'notDownloadedYet' : formatDate(rowData["downloadDate"], 'dd.MM.yyyy - hh:mm:ss', 'en'),
          icon: "custom-download-icon",
          class: !rowData["downloadDate"] ? "svg-mat-icon" : "svg-mat-icon-visited",
        }];
    });
  }


  openRevision() {
    this.router.navigate([`/companies/${this.bs.params['_idCompany']}/project/${this.bs.params['_idProject']}/document/${this.sidebarData.id}`]);
  }

}

