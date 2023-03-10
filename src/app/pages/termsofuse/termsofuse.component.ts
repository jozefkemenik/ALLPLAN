import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';
import { ConfigService } from 'src/app/services/config.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { DialogTermsofuseComponent } from './dialog/dialog-termsofuse.component';
import { HttpService } from 'src/app/core/services/http.service';
import { AuthService } from 'src/app/core/guards/auth.service';
@Component({
  selector: 'ap-termsofuse',
  templateUrl: './termsofuse.component.html',
  styleUrls: ['./termsofuse.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TermsofuseComponent implements OnInit {
  urlPath: any;
  loading: boolean = false;



  constructor(
    protected configService: ConfigService,
    public ts: TranslationService,
    private ds: DomSanitizer,
    private http: HttpService,
    public dialog: MatDialog,
    private as: AuthService) {
    this.setLink();
    this.ts.change$.subscribe(() => {
      this.setLink();
    })
  }


  ngOnInit(): void {

  }

  accept() {
    this.loading = true
    this.http.post('accepttos', null).then(() => {
      this.as.acceptTerms();
    })
    .finally(() => {
        this.loading = false;
    })
  }

  setLink() {
    const url = this.configService.getUrlConfig()["terms_" + this.ts.language.icon];
    this.urlPath = this.ds.bypassSecurityTrustResourceUrl(url);
  }

  openDialog() {
    this.dialog.open(DialogTermsofuseComponent, { panelClass: 'dialog-termsofuse' });
  }
}




