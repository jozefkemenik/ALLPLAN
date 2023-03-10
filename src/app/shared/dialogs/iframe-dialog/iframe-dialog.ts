import { Component, ViewEncapsulation, Injectable, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslationService } from 'src/app/core/services/translation.service';
import { ConfigService } from 'src/app/services/config.service';
import { DomSanitizer } from '@angular/platform-browser';




export enum EIframeDialogType {
  TermsOfUse = "terms",
  Privacy = "privacy",
  Help = "help",
  ImPrint = "imprint"

}


@Component({
  selector: 'ap-iframe-dialog',
  templateUrl: './iframe-dialog.html',
  styleUrls: ['./iframe-dialog.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IframeDialogComponent implements OnInit {
  urlPath: any;
  loading = false;
  headerText = "";
  constructor(public dialogRef: MatDialogRef<IframeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ts: TranslationService,
    private configService: ConfigService,
    private ds: DomSanitizer) {
    this.loading = true;

    switch (this.data.type) {
      case EIframeDialogType.Help:
        this.headerText = "help";
        break;
      case EIframeDialogType.ImPrint:
        this.headerText = "footerImprint";
        break;
      case EIframeDialogType.Privacy:
        this.headerText = "footerPrivacy";
        break;
      case EIframeDialogType.TermsOfUse:
        this.headerText = "termsOfUse";
        break;
    }
   

  }

  ngOnInit(): void {
    this.setLink();
    setTimeout(() => {
      this.loading = false;
    }, 500)

  }

  setLink() {
    var url:string = this.configService.getUrlConfig()[this.data.type +"_"+ this.ts.language.icon];
    if(url && url.endsWith("pdf")){
      url+="#toolbar=0";
    }
    this.urlPath = this.ds.bypassSecurityTrustResourceUrl(url);
  }
}


@Injectable({ providedIn: 'root' })
export class IframeDialogProvider {
  constructor(private dialog: MatDialog) {
  }
  public open(type: EIframeDialogType): Promise<boolean> {
    return new Promise<any>((res, rej) => {
      const config = {
        disableClose: false,
        panelClass: "iframe-dialog",
        data: { type: type }
      };
      const dialogRef = this.dialog.open(IframeDialogComponent, config);
      dialogRef.afterClosed().subscribe(result => {
        res(result);
      });
    })
  }
}


