import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { Router } from '@angular/router';
import { LinkButtonGroup } from 'src/app/utils/linkbutton';
import { RoutePartsService } from '../../core/services/route-parts.service';
import { environment } from 'src/environments/environment';
import { TranslationService } from '../../core/services/translation.service';
import { LogsDialogProvider } from 'src/app/shared/dialogs/logs/logs-dialog';
import { TranslationDialogProvider } from 'src/app/shared/dialogs/translation/translation-dialog';
import { DynidDialogProvider } from 'src/app/shared/dialogs/dynid/dynid-dialog';
import { HttpService } from 'src/app/core/services/http.service';
import { AuthService } from 'src/app/core/guards/auth.service';

@Component({
  selector: 'ap-top-bar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TopBarComponent implements OnInit {

  links: LinkButtonGroup;
  urlData: string[];
  showTestMenu: boolean = environment.testmode;


  @Input() showPartialTopMenu: boolean;

  isUserLogOut: boolean;

  constructor(
    private router: Router,
    protected configService: ConfigService,
    public authService: AuthService,
    private routePartsService: RoutePartsService,
    public ts: TranslationService,
    public ldp: LogsDialogProvider,
    public ddp: DynidDialogProvider,

    public tdp: TranslationDialogProvider,
    private http: HttpService) {
    this.links = new LinkButtonGroup();
    this.links.addWithCaptionAndKey('dashboard', "");
    this.links.addWithCaptionAndKey('projects', "projects");
    this.links.addWithCaptionAndKey('news', "news");
    this.routePartsService.subscribenavigationEnd((rp) => {
      this.makeActiveLink();
    });

  }


  welcome: string = 'Welcome back, '; // TODO localization


  private makeActiveLink() {
    //unselect all
    this.links.select(-1);
    if (this.routePartsService.routeParts.length == 0) {
      this.links.select(0);
    } else {
      switch (this.routePartsService.routeParts[0].urlSegment) {
        case "companies":
        case "company":
          this.links.select(1);
          break;
        case "news":
          this.links.select(2);
          break;
      }
    }
  }

  ngOnInit() {
    this.makeActiveLink();
    this.isUserLogOut = this.authService.currentUser ? false : true;
  }

  doLogout() {
    this.authService.logout();
  }

  doLinkClick(id: number) {
    this.links.select(id);
    switch (id) {
      case 0: this.router.navigate(['/']); break;
      case 1: this.router.navigate(['/companies']); break;
      case 2: this.router.navigate(['/news']); break;
      default: console.log("No route defined for id: " + id);
    }
  }


  get userFullName(): string {
    if (!this.authService.currentUser)
      return "";
    return this.authService.currentUser.firstName + " " + this.authService.currentUser.lastName;
  }

  showProfile() {
    this.http.get('profile', { country: this.ts.language.icon }, 'text').then((url) => {
      window.open(url, '_blank');
    })
  }


  getHelpUrl() {
    this.getHelpUrl
    return this.configService.getUrlConfig()["help_" + this.ts.language.icon];
  }

  get linksWithId(): any[] {
    return this.links.get().map(link => {
      link['idname'] = `adms-topbar-buttonlink-${link.key == "" ? "dashboard" : link.key}`;
      return link;
    })
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
