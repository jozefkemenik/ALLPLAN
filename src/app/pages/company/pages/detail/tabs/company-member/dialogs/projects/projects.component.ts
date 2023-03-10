import { Component, EventEmitter, Inject, Injectable, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ETableAction, PayLoad, TableAction } from '@shared/components/table/models/TableAction.model';
import { EColumnConfigType, ITableConfig } from '@shared/components/table/models/TableConfig.model';
import { DataAndTotalCountResult } from '@shared/models/api/DataAndTotalCountResult';

@Component({
  selector: 'ap-company-member-sidebar-detail-dialog-projects',
  templateUrl: './projects.component.html',
  styleUrls:  ['./projects.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class CompanyMemberSidebarDetailDialogProjectsComponent implements OnInit {

  tableConfig: ITableConfig;
  dataTable: DataAndTotalCountResult<any>;

  constructor(public dialogRef: MatDialogRef<CompanyMemberSidebarDetailDialogProjectsProvider>, 
    @Inject(MAT_DIALOG_DATA) public data: any) {
   
  }

  ngOnInit() {
    this.initTableConfig();
  }

  private initTableConfig() {
    // var localeDateFormat = this.commonService.getLocaleDateTimeFormat(this.locale);
    this.tableConfig = {
      tableContext: "ap-company-member-sidebar-detail-dialog-projects",
      tableInstance: "",
      pageSizeOptions: [5, 20, 50],
      pageSizeIndex: 1,
      hasAction: false,
      canSelectRows:false,
      sort: { key: "project", direction: "asc" },
      emptyTable: {
        textOne: 'emptyProjectDocument1',
        textTwo: 'emptyProjectDocument2'
      },
      confColumns: [{
        key: 'project',
        header: 'projects',
        type: EColumnConfigType.Str,
        minimalWidth:"300px",
        maximalWidth:"1000px",
        initialWidth: 'auto',
      },
      {
        key: 'role',
        header: 'projectRole',
        type: EColumnConfigType.Str,
        initialWidth: 'auto',
      }]
    };
  }

  /**
  * 
  * @param pl 
  */
   private load(pl: PayLoad) {
    var data = this.data && this.data.roles ? this.data.roles.map(r => {
      return {
        project: r.targetName,
        role: r.role.assignedRole
      }
    }) : [];
    //direction
    var asc = (pl.sortingConfig[0] as string).slice(0, 1) == '@';
    var desc = (pl.sortingConfig[0] as string).slice(0, 1) == '-';
    //parameter name
    var sortParameter = (pl.sortingConfig[0] as string).slice(1);
    var sortedData =data
    //sorting
     var sortedData = (asc || desc)?sortBy(data, sortParameter, asc):data; 
    //pagination
    var paginatedData = paginate(sortedData, pl.pageSize, pl.pageIndex + 1);
    //populate table
    this.dataTable = { data: paginatedData, total: data.length };
  }

  onTableAction(action: TableAction) {
    switch (action.eTableAction) {
      case ETableAction.REFRESH:
        this.load(action.payLoad);
        break;
      case ETableAction.ACTIONS:
        break;
      case ETableAction.SELECTION:
        break;
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}

@Injectable({ providedIn: 'root' })
export class CompanyMemberSidebarDetailDialogProjectsProvider {
  constructor(private dialog: MatDialog) {

  }
  public open(data: any): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {// height: "60vh"
      const config = {disableClose: true, width: "60%", height: "75%", data: data };
      
      const dialogRef = this.dialog.open(CompanyMemberSidebarDetailDialogProjectsComponent, config);
      dialogRef.afterClosed().subscribe(result => {
        res(result);
      });

    })

  }
}


var sortBy = function (arr, p, asc = true) {
  return arr.slice(0).sort(function (a, b) {
    var x = a[p].toLowerCase();
    var y = b[p].toLowerCase();
    if (asc) {
      return (x > y) ? 1 : (x < y) ? -1 : 0;
    }
    return (x > y) ? -1 : (x < y) ? 1 : 0;
  });
}

function paginate(array, page_size, page_number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}


