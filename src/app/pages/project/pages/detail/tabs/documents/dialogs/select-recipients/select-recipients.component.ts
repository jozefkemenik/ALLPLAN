import { Component, EventEmitter, Inject, Injectable, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ETableAction, PayLoad, TableAction } from '@shared/components/table/models/TableAction.model';
import { EColumnConfigType, ITableConfig } from '@shared/components/table/models/TableConfig.model';
import { DataAndTotalCountResult } from '@shared/models/api/DataAndTotalCountResult';
import { TranslationService } from 'src/app/core/services/translation.service';
import { AlertService } from 'src/app/services/alert.service';
import { SelectRecipientsService } from './select-recipients.service';

class RecipientInfo {
  recipientId: string;
  actionText?: string[] = [];
  revisionIds: string[];
}

export class sendRecipient {
  notifierGroupId: string;
  recipients: RecipientInfo[];
}

@Component({
  selector: 'app-select-recipients',
  templateUrl: './select-recipients.component.html',
  styleUrls: ['./select-recipients.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectRecipientsDialogComponent implements OnInit {

  tableConfig: ITableConfig;
  dataTable: DataAndTotalCountResult<any>;
  @Output() getSelectionOutput = new EventEmitter<any[]>(); //to parent get information of every change on checked row/rows in table component
  projectId: string;

  isLoading: boolean = false;
  revisions: any[];
  companyId: string;
  selectedRows: any[]

  //revisionIds
  //notifierGroupId

  constructor(public dialogRef: MatDialogRef<SelectRecipientsDialogProvider>, @Inject(MAT_DIALOG_DATA) public data: any, private selectParticipantService: SelectRecipientsService, private ts: TranslationService, private alertService: AlertService) {
    this.projectId = data.dataKey.projectId;
    this.companyId = data.dataKey.companyId;
    this.revisions = data.dataKey.revisions;
  }

  ngOnInit() {
    this.initTableConfig();
  }

  private initTableConfig() {
    // var localeDateFormat = this.commonService.getLocaleDateTimeFormat(this.locale);
    this.tableConfig = {
      tableContext: "project-participants-select-recipients",
      tableInstance: "inbox",
      pageSizeOptions: [5, 20, 50],
      pageSizeIndex: 1,
      hasAction: false,
      noActive: row => !row.verified,
      emptyTable: {
        textOne: 'emptyProjectDocument1',
        textTwo: 'emptyProjectDocument2'
      },
      confColumns: [{
        key: 'name',
        header: this.ts.translate("name"),
        type: EColumnConfigType.Str,
        initialWidth: '30%',
        maximalWidth: '500px'
      },
      {
        key: 'email',
        header: this.ts.translate("mail"),
        type: EColumnConfigType.Str,
        initialWidth: '30%',
        maximalWidth: '500px'
      }]
    };
  }

  private load(pl: PayLoad) {
    pl['projectId'] = this.projectId;
    this.selectParticipantService.getData(pl).then((res) => {
      // this.addActionsForRow(res.data)
      this.dataTable = res;
    })
  }

  onTableAction(action: TableAction) {
    switch (action.eTableAction) {
      case ETableAction.REFRESH:
        this.load(action.payLoad);
        break;
      case ETableAction.ACTIONS:
        // this.DownloadFile(action.data);
        break;
      case ETableAction.SELECTION:
        this.selectedRows = action.data;
        //this.getSelectionOutput.emit(action.data);
        break;
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  /*
 {
 "notifierGroupId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 "recipients": [
   {
     "recipientId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
     "actionText": [
       "string"
     ],
     "revisionIds": [
       "3fa85f64-5717-4562-b3fc-2c963f66afa6"
     ]
   }
 ]
}
 */


  send(event: any) {
    let result = new sendRecipient();
    result.notifierGroupId = this.companyId;

    let revisionsIds = [];
    this.revisions.forEach(element => {
      revisionsIds.push(element.id);
    });

    let recipients = new Array<RecipientInfo>;
    this.selectedRows.forEach(el => {
      let recipientInfo = new RecipientInfo();
      recipientInfo.recipientId = el.id;
      recipientInfo.revisionIds = revisionsIds;
      recipients.push(recipientInfo);
    });
    result.recipients = recipients;
    this.isLoading = true;
    let success = false;
    this.selectParticipantService.selectRecipients(result).then(
      (res: any) => {
        this.alertService.success(this.ts.translate("emailSent"), '', null, 5000);
        success = true;
      },
      // not 200
      err => {
        this.alertService.error(this.ts.translate("sendingFailed"), '', null, 10000);
        console.log(err);
      }
    ).finally(() => {
      this.isLoading = false;
      if (success) {
        this.dialogRef.close();
      }
    });
  }

}

@Injectable({ providedIn: 'root' })
export class SelectRecipientsDialogProvider {
  constructor(private dialog: MatDialog) {

  }
  public open(data: any): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {// height: "60vh"
      const config = {
        disableClose: true, width: "60vw", height: "520px", data: { dataKey: data }
      };
      const dialogRef = this.dialog.open(SelectRecipientsDialogComponent, config);
      dialogRef.afterClosed().subscribe(result => {
        res(result);
      });

    })

  }
}