import { Component, Injectable, Output, EventEmitter, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/guards/auth.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'ap-dialogs-logs',
  templateUrl: './logs-dialog.html',
  styleUrls: ['./logs-dialog.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LogsDialog {
  data: any;
  displayedColumns: string[] = ['on', 'status', 'takes', 'api'];
  constructor(public authService: AuthService, private _liveAnnouncer: LiveAnnouncer) {
    this.load()
  }



  @ViewChild(MatSort) sort: MatSort;




  ngAfterViewInit() {
    this.data.sort = this.sort;
  }


  load() {
    var strLogs = localStorage.getItem('httplogs');
    try {
      this.data =  strLogs? new MatTableDataSource(JSON.parse(strLogs))
      :new MatTableDataSource([]);

    } catch (e) {
    }
  }

  clear(){
    localStorage.removeItem('httplogs');
    this.data = new MatTableDataSource([]);
  }
  export(){
 
      var strLogs = localStorage.getItem('httplogs');
      if(strLogs){
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(new Blob([strLogs], {type: "text/plain"}));
        a.download = "http-logs.json";
        a.click();
       
        a.remove(); 
      } 
  }


  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }




}

@Injectable({ providedIn: 'root' })
export class LogsDialogProvider {
  constructor(private dialog: MatDialog) {

  }
  public open() {
    const config = { disableClose: true };
    const dialogRef = this.dialog.open(LogsDialog, config);
    dialogRef.afterClosed().subscribe(result => {

    });
  }
}








