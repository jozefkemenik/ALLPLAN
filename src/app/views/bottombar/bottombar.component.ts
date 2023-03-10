import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { TranslationService } from '../../core/services/translation.service';
import { _MatTabLinkBase } from '@angular/material/tabs';
import { ILanguage } from '../../shared/models/ILanguage';
import { Router } from '@angular/router';


@Component({
  selector: 'ap-bottom-bar',
  templateUrl: './bottombar.component.html',
  styleUrls: ['./bottombar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BottomBarComponent implements OnInit {
  links: Array<Link> = new Array<Link>();
  langs: ILanguage[];

  linkIndex: number = -1;

  constructor(protected configService: ConfigService,
    public ts: TranslationService,
    private router: Router) {
  }

  ngOnInit() {
    this.langs = this.ts.languages;
    this.refreshLinks();
  }

  refreshLinks() {
    this.links.push(new Link(0, "imprint", 'footerImprint', 'legal-notice', false));
    this.links.push(new Link(1, "privacy", 'footerPrivacy', 'privacy-policy', false));
    this.links.push(new Link(2, "terms", 'footerTermsOfUse', 'terms-of-use', false));
    this.links.push(new Link(3, "allplan", "© ALLPLAN GMBH", '', false));
  }

  setLinkIndex(index: number) {
    this.linkIndex = index;
  }

  goToUrl(url: string) {
    return this.router.navigate(['/' + url]);
  }

  isActiveLink(page: string) {
    if (page.length > 0)
      return this.router.url.replace(/\//, '') == page;
    return false;
  }

}

export class Link {
  constructor(
    public id: number,
    public key: string,
    public name: string,
    public url: string,
    public selected: boolean
  ) { }
}