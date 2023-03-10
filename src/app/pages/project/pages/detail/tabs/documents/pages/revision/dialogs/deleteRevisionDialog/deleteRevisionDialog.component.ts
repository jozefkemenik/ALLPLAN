import { Component, Inject, Injectable, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentRevision } from '@shared/models/api/documentRevision';
import { TranslationService } from 'src/app/core/services/translation.service';
import { RevisionService } from '../../revision.service';

@Component({
  selector: 'ap-project-detail-documents-revision-dialog-delete',
  templateUrl: './deleteRevisionDialog.component.html',
  styleUrls: ['./deleteRevisionDialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DeleteRevisionDialogComponent implements OnInit {

  checked = false;
  subtitle: string = "";
  errorMessage: string = "";
  selected: DocumentRevision[];

  //spinner button config
  isLoading: boolean = false;

  dialogResponse: boolean = false;

  showErrorMessage: boolean = false;

  constructor(public dialogRef: MatDialogRef<DeleteRevisionDialogComponent>, private ts: TranslationService, @Inject(MAT_DIALOG_DATA) public data: any, private revisionService: RevisionService) { 
    this.selected = data.dataKey.selected as DocumentRevision[];
    this.errorMessage = (this.selected?.length > 1 ? this.ts.translate('errorDeleteDocuments') : this.ts.translate('errorDeleteDocument')); //todo can be changed in future 
    this.subtitle = this.selected?.length > 1 ? (this.ts.translate('documentRevisionsSelected') + " (" + this.selected?.length + ")") : this.selected[0].fileName;
  }

  ngOnInit() {
  }

  sendRequest(request: string) {
    switch (request) {
      case "delete":
        this.isLoading = true;
        this.dialogResponse = false;
        this.showErrorMessage = false;
        this.revisionService.DeleteRevisions(this.selected).then(
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
export class DeleteRevisionDialogProvider {
  constructor(private dialog: MatDialog) {

  }
  public open(data: any): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
      const config = {
        disableClose: true, width: "400px", height: "240px", data: { dataKey: data }
      };
      const dialogRef = this.dialog.open(DeleteRevisionDialogComponent, config);
      dialogRef.afterClosed().subscribe(result => {
        res(result);
      });

    })

  }
}