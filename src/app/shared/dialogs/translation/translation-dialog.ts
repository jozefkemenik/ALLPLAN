import { Component, Injectable, Output, EventEmitter, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/guards/auth.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslationService } from 'src/app/core/services/translation.service';


@Component({
  selector: 'ap-translation-dialog',
  templateUrl: './translation-dialog.html',
  styleUrls: ['./translation-dialog.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TranslationDialog {
  data: any;
  langs:[];
  logs:Array<string>;
  fileName:string;
  file:File;
  requiredFileType:string="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  constructor(public authService: AuthService, public ts: TranslationService) {
   
  }



  @ViewChild(MatSort) sort: MatSort;


  exportAll() { this.ts.exportXlsFiles();}
  export(lang:string){
    this.ts.makeXlsFile(lang);
  }
  import() { }

  onFileSelected(event) {
    this.file = event.target.files[0];
    if (this.file) {
      this.fileName=this.file.name;
    }
    
}

generateJson(){

 this.ts.read(this.file).then((logs)=>{
  this.logs = logs;
  this.ts.exportJson();
 })
 
}


  
}

@Injectable({ providedIn: 'root' })
export class TranslationDialogProvider {
  constructor(private dialog: MatDialog) {

  }
  public open() {
    const config = { disableClose: true, panelClass: "translation-dialog" };
    const dialogRef = this.dialog.open(TranslationDialog, config);
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}








