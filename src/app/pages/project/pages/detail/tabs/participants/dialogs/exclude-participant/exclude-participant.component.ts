import { Component, Inject, Injectable, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/guards/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { ParticipantsService } from '../../participants.service';

@Component({
  selector: 'ap-project-particpants-dialogs-exclude-participant',
  templateUrl: './exclude-participant.component.html',
  styleUrls: ['./exclude-participant.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExcludeParticipantComponent implements OnInit {

  checked = false;
  subtitle: string = "";
  errorMessage: string = "";
  selected: any[]; //todo type
  isLoading: boolean = false;
  dialogResponse: boolean = false;

  projectId: string;
  userId: string;

  constructor(
    private participantsService: ParticipantsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ExcludeParticipantComponent>,
    private alertService: AlertService) {
    this.projectId = this.data.dataKey.projectId;
    this.userId = this.data.dataKey.userId;
    this.subtitle = this.data.dataKey.name;
  }

  ngOnInit() {
  }

  sendRequest(request: string) {
    switch (request) {
      case "delete":
        this.isLoading = true;
        this.dialogResponse = false;
        this.participantsService.excludeParticipant(this.userId, this.projectId).then(
          res => {
            this.dialogResponse = true;
          }, err => {
            this.alertService.error('excludingFailed', "", null, 10000);
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
export class ExcludeParticipantDialogProvider {
  constructor(private dialog: MatDialog) {

  }
  public open(data: any): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
      const config = {
        disableClose: true, width: "400px", height: "240px", data: { dataKey: data }
      };
      const dialogRef = this.dialog.open(ExcludeParticipantComponent, config);
      dialogRef.afterClosed().subscribe(result => {
        res(result);
      });

    })

  }
}