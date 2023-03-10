

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { EmptyTable } from '@shared/components/empty-section/empty-section.component';
import { ProgressBarAnimated } from '@shared/components/progress-bar-animated/progress-bar-animated.component';
import { Company } from '@shared/models/api/Company';
import { CompanyInfoService, resultCompanyInfoData } from './company-info.service';


@Component({
  selector: 'ap-company-detail-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CompanyInfoComponent implements OnInit {

  loading: boolean = false;
  progressBarData: ProgressBarAnimated;
  data: Company

  @Input() companyId: string;
  @Input() disabled: boolean = false;

  config: EmptyTable = new EmptyTable();

  constructor(private cs: CompanyInfoService) {
    this.config.textOne = "accessDenied";
    this.config.textTwo = "accessDeniedMessage";
    this.config.icon = null;
    this.config.img = 'assets/images/lock.svg';
    this.config.learnMore = null;
    this.config.url = null;
  }

  ngOnInit() {
    if (!this.disabled) {
      this.loading = true;
      this.cs.getCompanyInfoData(this.companyId).then((r) => {
        this.data = (<resultCompanyInfoData>r).c;
        this.progressBarData = (<resultCompanyInfoData>r).p;
      }).finally(() => {
        this.loading = false;
      })
    }
  }
}
