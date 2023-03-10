import { Component, Inject, Injectable, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectDocument } from '@shared/models/api/ProjectDocument';
import { TranslationService } from 'src/app/core/services/translation.service';
import { ProjectDocumentsService } from 'src/app/services/projectDocuments.service';

@Component({
  selector: 'ap-project-documents-dialogs-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DeleteDocumentsDialogComponent implements OnInit {

  checked = false;
  subtitle: string = "";
  errorMessage: string = "";
  selected: ProjectDocument[];

  //spinner button config
  isLoading: boolean = false;

  dialogResponse: boolean = false;

  showErrorMessage: boolean = false;

  constructor(public dialogRef: MatDialogRef<DeleteDocumentsDialogComponent>, private ts: TranslationService, @Inject(MAT_DIALOG_DATA) public data: any, private projectDocumentsService: ProjectDocumentsService) {
    this.selected = data.dataKey.selected as ProjectDocument[];
    this.errorMessage = (this.selected?.length > 1 ? this.ts.translate('errorDeleteDocuments') : this.ts.translate('errorDeleteDocument')); //todo can be changed in future 
    this.subtitle = this.selected?.length > 1 ? (this.ts.translate('documentsSelected') + " (" + this.selected?.length + ")") : this.selected[0].fileName;
  }

  ngOnInit() {
  }


  sendRequest(request: string) {
    switch (request) {
      case "delete":
        this.isLoading = true;
        this.dialogResponse = false;
        this.showErrorMessage = false;
        this.projectDocumentsService.DeleteDocuments(this.selected).then(
          res => {
            this.dialogResponse = true;
          }, err => {
            this.showErrorMessage = true;
            console.log(err);
          }).finally(() => {
            this.isLoading = false;
            if (this.dialogResponse) {
              this.dialogRef.close(this.dialogResponse);
            }
          });
        break;
      case "cancel":
        this.dialogRef.close();
        break;
      default:
        break;
    }
  }

}

@Injectable({ providedIn: 'root' })
export class DeleteDocumentsDialogProvider {
  constructor(private dialog: MatDialog) {

  }
  public open(data: any): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
      const config = {
        disableClose: true, width: "400px", height: "240px", data: { dataKey: data }
      };
      const dialogRef = this.dialog.open(DeleteDocumentsDialogComponent, config);
      dialogRef.afterClosed().subscribe(result => {
        res(result);
      });

    })

  }
}
