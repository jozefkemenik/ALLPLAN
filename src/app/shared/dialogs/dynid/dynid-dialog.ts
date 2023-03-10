import { Component, Injectable, Output, EventEmitter, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'ap-dynid-dialog',
  templateUrl: './dynid-dialog.html',
  styleUrls: ['./dynid-dialog.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DynidDialog {
  data: any;
  displayedColumns: string[] = ['hash', 'pathCalc'];
  constructor(private _liveAnnouncer: LiveAnnouncer) {
    this.load()
  }



  @ViewChild(MatSort) sort: MatSort;




  ngAfterViewInit() {
    this.data.sort = this.sort;
  }


  load() {
    var arr=[];
    const str = localStorage.getItem('dynamic-id');
    if(str){
      arr = JSON.parse(str)
    }
    
    try {
      this.data =  arr.length? new MatTableDataSource(arr)
      :new MatTableDataSource([]);

    } catch (e) {
    }
  }


  clear(){
    localStorage.removeItem('dynamic-id');
    this.data = new MatTableDataSource([]);
  }

  export(){
 
      var obj = localStorage.getItem('dynamic-id');
      if(obj){
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(new Blob([obj], {type: "text/plain"}));
        a.download = "dynamic-id.json";
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
export class DynidDialogProvider {
  constructor(private dialog: MatDialog) {

  }
  public open() {
    const config = { disableClose: true };
    const dialogRef = this.dialog.open(DynidDialog, config);
    dialogRef.afterClosed().subscribe(result => {

    });
  }
}








