import { Component, Inject, Injectable, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/guards/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { CompanyMemberService } from '../../company-member.service';

@Component({
  selector: 'ap-company-member-dialogs-exclude-member',
  templateUrl: './exclude-member.component.html',
  styleUrls: ['./exclude-member.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExcludeMemberComponent implements OnInit {

  checked = false;
  subtitle: string = "";
  errorMessage: string = "";
  selected: any[]; //todo type
  isLoading: boolean = false;
  dialogResponse: boolean = false;

  companyId: string;
  userIds: Array<string>;

  constructor(private companyMemberService: CompanyMemberService, private alertService: AlertService, public dialogRef: MatDialogRef<ExcludeMemberComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private as: AuthService) {
    this.companyId = this.data.dataKey.companyId;
    this.userIds = this.data.dataKey.userIds;
    if (this.userIds.length === 1)
      this.subtitle = this.data.dataKey.name;
    else this.subtitle = this.data.dataKey.name + " (" + this.userIds.length.toString() + ")";
  }

  ngOnInit(): void {
  }

  sendRequest(request: string) {


    switch (request) {
      case "delete":
        let includeCurrentUserId = false;
        let newUserIds = this.userIds;
        if (this.userIds.includes(this.as.currentUser.id)) {
          if (this.userIds.length === 1) {
            this.alertService.error('excludingYourselfSubtitle', "", null, 10000);
            this.dialogRef.close(false);
            return;
          }
          newUserIds = [];
          for (let userId of this.userIds) {
            if (userId === this.as.currentUser.id) {
              includeCurrentUserId = true;
              continue;
            }
            newUserIds.push(userId);
          }

          //todo red toast message
          //ak ich je viacej zavolaj api a toast message o fail sameho seba sprav vo finally..
        }
        this.isLoading = true;
        this.dialogResponse = false;
        this.companyMemberService.excludeMember(newUserIds, this.companyId).then(
          res => {
            this.dialogResponse = true;
          }, err => {
            this.alertService.error('excludingFailed', "", null, 10000);
            console.log(err);
          }).finally(() => {
            this.isLoading = false;
            if (this.dialogResponse) {
              this.dialogRef.close(this.dialogResponse);
              if (includeCurrentUserId) {
                this.alertService.warn('weExcludedSelectedUsers', "excludingYourselfSubtitle", null, 5000);
              } else {
                if (newUserIds.length === 1)
                  this.alertService.warn('weExcludedSelectedUser', "", null, 5000);
                else
                  this.alertService.warn('weExcludedSelectedUsers', "", null, 5000);
              }
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
export class ExcludeMemberDialogProvider {
  constructor(private dialog: MatDialog) {

  }
  public open(data: any): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
      const config = {
        disableClose: true, width: "400px", height: "240px", data: { dataKey: data }
      };
      const dialogRef = this.dialog.open(ExcludeMemberComponent, config);
      dialogRef.afterClosed().subscribe(result => {
        res(result);
      });

    })

  }
}
