import { Component} from '@angular/core';
import {BreadcrumbsService} from './breadcrumbs.service';


@Component({
  selector: 'ap-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {
  constructor(public bs:BreadcrumbsService) {
  }
}
