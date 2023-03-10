import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RoutePartsService } from '../../core/services/route-parts.service';


@Component({
  selector: 'ap-main-page',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})

export class MainPageComponent {

  appTitle = 'AllDoc';
  showTopMenu = false;
  showPartialTopMenu= false;
  isShowingRouteLoadIndicator = false;
  constructor(
    public title: Title,
    private routePartsService: RoutePartsService) {
    this.registerRoutingChange();
  }

  registerRoutingChange() {

    // emits when navigation ends
    this.routePartsService.subscribenavigationEnd((rp) => {
      var pageTitle = rp.map((part) => part.title?part.title:part.label).join('>'); 
      pageTitle += `${rp.length?' | ':''}${this.appTitle}`;
      this.title.setTitle(pageTitle);
      this.showTopMenu       = rp.length==0 || !rp[0].data  || !rp[0].data['hideTopMenu'];
      this.showPartialTopMenu= rp.length    &&  rp[0].data  &&  rp[0].data['showPartialTopMenu'];
    });
  }
}
