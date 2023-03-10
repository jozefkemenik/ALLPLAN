import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { RoutePartsService } from '../../core/services/route-parts.service';
import { Subscription } from 'rxjs';
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
  selector: 'ap-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PublicComponent implements OnInit, OnDestroy {
  subscriber: Subscription;
  link: string;
  loading = false;
  urlPath: any;
  headerText: string;

  constructor(private rps: RoutePartsService,
    private ts: TranslationService,
    private configService: ConfigService,
    private ds: DomSanitizer

  ) {
    this.subscriber = this.rps.subscribenavigationEnd((rp) => {
      this.link = rp[0].data['type'];
    });
    this.loading=true;
  }

  ngOnInit(): void {
    switch (this.link) {
      case EIframeDialogType.Help:
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

    this.setLink();
    setTimeout(() => {
      this.loading = false;
    }, 500)

  }

  setLink() {
    var url: string = this.configService.getUrlConfig()[this.link + "_" + this.ts.language.icon];
    if (url && url.endsWith("pdf")) {
      url += "#toolbar=0";
    }
    this.urlPath = this.ds.bypassSecurityTrustResourceUrl(url);
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }
}
