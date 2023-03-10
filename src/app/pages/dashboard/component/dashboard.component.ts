import { OnInit, ViewChild, Component, ViewEncapsulation } from '@angular/core';
import { ITableConfig, EColumnConfigType } from '@shared/components/table/models/TableConfig.model';
import { ETableAction, TableAction, PayLoad } from '@shared/components/table/models/TableAction.model';
import { DataAndTotalCountResult } from '@shared/models/api/DataAndTotalCountResult';
import { TableProvider } from 'src/app/shared/components/table/table.component'
import { MatSnackBar } from '@angular/material/snack-bar';
import { InboxService } from 'src/app/services/inbox.service';
import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'ap-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  searchValue: string;
  selectionTableData: Array<any> = [];
  search = "";
  
  /** table part */
  dataTable: DataAndTotalCountResult<any>;
  tableConfig: ITableConfig;
  /** end table part */

  constructor(private _snackBar: MatSnackBar,
    private tp: TableProvider,
    private inboxService: InboxService) { }

  protected getInitialDataQuery(): any {
    return { path: `${InboxService.INBOX_DOC_PATH}` };
  }

  ngOnInit() {
    this.initTableConfig();
  }


  protected initTableConfig() {
    this.tableConfig = {
      tableContext: "project-documents",
      tableInstance: "inbox",
      pageSizeOptions: [5, 20, 50],
      pageSizeIndex: 1,
      hasAction: true,
     // sort: { key: "documentName", direction: "asc" },
      //we can define condition on whole row
      //noActive:row=>row.id=='f8a94cc8-8007-4fdf-a518-609849769c50',
      emptyTable: {
        textOne: 'emptyInbox',
        textTwo: 'noFilesReceived',
      },
      confColumns: [{
        key: 'documentName',
        header: 'inboxColHeaderFileName',
        type: EColumnConfigType.Str,
        initialWidth: '30%',
        sticky: true,
      },
      {
        key: 'projectName',
        header: 'inboxColHeaderProject',
        type: EColumnConfigType.Str,
        initialWidth: '15%',
      }, {
        key: 'companyName',
        header: 'inboxColHeaderCompany',
        type: EColumnConfigType.Str,
        initialWidth: '15%',
      }, {
        key: 'planType',
        header: 'inboxColHeaderPlanType',
        type: EColumnConfigType.Str,
        initialWidth: '130px',
      }, {
        key: 'dataType',
        header: 'inboxColHeaderDataType',
        type: EColumnConfigType.FileType,
      }, {
        key: 'uploadDate',
        header: 'inboxColHeaderUpload',
        type: EColumnConfigType.LongDate,
      }, {
        key: 'notificationDate',
        header: 'inboxColHeaderNotifDate',
        type: EColumnConfigType.LongDate,  
      }
      ]
    };
  }


  /** 
    * @param action 
    */
  onTableAction(action: TableAction) {
    switch (action.eTableAction) {
      case ETableAction.REFRESH:
        this.load(action.payLoad);
        break;
      case ETableAction.ACTIONS:
        this.DownloadFile(action.data);
        break;
      case ETableAction.SELECTION:
        this.selectionTableData = action.data;
        break;
    }
  }
  /**
   * 
   * @param pl 
   */
  private load(pl: PayLoad) {
    this.inboxService.getData(pl).then((res) => {
      this.addActionsForRow(res.data)
      this.dataTable = res;
    })
  }

  doSearch() {
      this.search=this.searchValue;
  }
  closeSearch() {
    this.search="";
  }








  private async DownloadFile(action) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append(`id`, action.row.id);
    await this.inboxService.revisionDownload(queryParams, action.row.documentName).then((data: any) => {
      if (data.class === "svg-mat-icon-visited") {
        let actualDate = formatDate(new Date(), 'dd.MM.yyyy - hh:mm:ss', 'en');
        action.row.actions[0].tooltip = actualDate;
      }
      action.row.actions[0].class = data.class;
    });
  }



  getDetailsDialogData(actionData: any): any {
    var td = null;
    if (actionData.extraData != null) {
      td = [];
      for (let key in actionData.extraData) {
        td.push({ key: [key], value: actionData.extraData[key] });
      }
    }
    return { name: actionData.name, tableData: td };
  }


  //to data which we have add new data with actions which can be used on row and are seen in last column
  private addActionsForRow(eventData: any) {
    return eventData.forEach(rowData => {
      rowData["actions"] =
        [{
          name: ETableAction.DOWNLOAD,
          tooltip: rowData["downloadDate"] == undefined ? 'notDownloadedYet' : formatDate(rowData["downloadDate"], 'dd.MM.yyyy - hh:mm:ss', 'en'),
          icon: "custom-download-icon",
          class: rowData["downloadDate"] == undefined ? "svg-mat-icon" : "svg-mat-icon-visited",
        }];
      return rowData;
    });


  }

  multipleDownloads() {
    this.DownloadFiles();
  }

  private async DownloadFiles() {
    let queryParams = new HttpParams();

    this.selectionTableData.forEach(value => {
      queryParams = queryParams.append(`id`, value.id);
    });

    await this.inboxService.revisionDownload(queryParams, this.selectionTableData[0].documentName).then((json: any) => {
      let actualDate = formatDate(new Date(), 'dd.MM.yyyy - hh:mm:ss', 'en');
      if (json.class == "svg-mat-icon-visited") {
        this.selectionTableData.forEach(value => {
          //check if some id is excluded first
          let isExcluded = false;
          if (json.excluded.length > 0) {
            isExcluded = json.excluded.find((o, i) => {
              if (o === value.id) return true;
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
}