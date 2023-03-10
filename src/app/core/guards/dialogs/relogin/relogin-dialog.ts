import { Component, Injectable, Output, EventEmitter,ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog} from '@angular/material/dialog';
import { AuthService } from '../../auth.service';
import { EDialogType } from '../../auth.model';

@Component({
  selector: 'ap-relogin-dialog',
  templateUrl: './relogin-dialog.html',
  styleUrls: ['./relogin-dialog.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReloginDialog {
  @Output() isAuthenticated = new EventEmitter<boolean>();
  private timer: any;
  decrementer: number = 10;
  constructor(public dialogRef: MatDialogRef<ReloginDialog>, private dialog: MatDialog) {}

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

@Injectable({ providedIn: 'root' })
export class ReloginDialogProvider {
  constructor(private dialog: MatDialog, private authService: AuthService) {
    this.authService.subscribeDialog(EDialogType.relogin,() => {
      return new Promise<boolean>(resolve => {
        this.open(resolve)
      });
    });
  }
  public open(fn: (isOk: boolean) => void) {
    const config = { disableClose: true };
    const dialogRef = this.dialog.open(ReloginDialog, config);
    dialogRef.afterClosed().subscribe(result => {
      fn(result);
    });
  }
}








