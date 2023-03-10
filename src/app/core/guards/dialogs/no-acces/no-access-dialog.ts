import { Component, Injectable, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import { MatDialogRef, MatDialog} from '@angular/material/dialog';
import { AuthService } from '../../auth.service';
import { EDialogType } from '../../auth.model';


@Component({
  selector: 'ap-no-access-dialog',
  templateUrl: './no-access-dialog.html',
  styleUrls: ['./no-access-dialog.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NoAccessDialog {
  @Output() isAuthenticated = new EventEmitter<boolean>();
  private timer: any;
  decrementer: number = 10;

  constructor(public dialogRef: MatDialogRef<NoAccessDialog>) {


  }
/**  after 5 seconds redirect to login page */
  ngOnInit() {
    this.timer = setInterval(() => {
      this.decrementer--;
      if (this.decrementer == 0) {
        clearInterval(this.timer);
        this.dialogRef.close(true);
      }
    }, 1000);
  }
  ngOnDestroy() {
    clearInterval(this.timer);
  }
}

@Injectable({ providedIn: 'root' }
)
export class NoAccessDialogProvider {
  constructor(private dialog: MatDialog, private authService: AuthService) {
    this.authService.subscribeDialog(EDialogType.noacces, () => {
      return new Promise<boolean>(resolve => {
        this.open(resolve)
      });
    });
  }
  public open(fn: (isOk: boolean) => void) {
    const config = { disableClose: true };
    const dialogRef = this.dialog.open(NoAccessDialog, config);

    dialogRef.afterClosed().subscribe(result => {
      fn(result);
    });
  }

}








