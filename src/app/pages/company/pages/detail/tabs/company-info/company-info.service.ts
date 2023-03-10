import { Injectable } from '@angular/core';
import { Company } from '@shared/models/api/Company';
import { HttpService } from 'src/app/core/services/http.service';
import { formatDate } from '@angular/common';
import { ProgressBarAnimated } from '@shared/components/progress-bar-animated/progress-bar-animated.component';
import { ConvertBytesToGBPipe } from '@shared/pipes/convertBytes.pipe';


export type resultCompanyInfoData = {p:ProgressBarAnimated;c: Company}
@Injectable({
  providedIn: 'root'
})
export class CompanyInfoService {
  
  constructor(private httpService: HttpService,
    private convertBytesToGB: ConvertBytesToGBPipe
     ) { }

  getCompanyInfoData(companyId: string){
    return this.getCompanyInfo(companyId).then(
      resp => {
        var progressBarData = new ProgressBarAnimated();
        var companyInfoData: Company = resp;
        let date = this.formattedValue(companyInfoData.expirationDate, 'dd.MM.yyyy');
        companyInfoData.expirationDate = date.toString();
        progressBarData.tagWidth = 416;
        progressBarData.tagHeight = 66;
        progressBarData.percentage = this.getProgressBarPercentage(companyInfoData);
        progressBarData.tagMaxWidth = (progressBarData.tagWidth / 100) * progressBarData.percentage;
        progressBarData.totalWidth = companyInfoData.totalDiskSpace;
        progressBarData.freeWidth = companyInfoData.freeDiskSpace;
        progressBarData.innerText = progressBarData.percentage.toString() + '%';
        progressBarData.bottomText = this.convertBytesToGB.transform(companyInfoData.totalDiskSpace, 0) + " GB";
        progressBarData.countSteps = progressBarData.percentage + 1;
        progressBarData.oneStepWidth = progressBarData.tagWidth / 100;       
        return  {c:companyInfoData,p:progressBarData} as resultCompanyInfoData;
      },
      err => {
        console.log(err);
      }
    ).finally(() => {
    })
  }

  private getProgressBarPercentage(companyInfoData: Company) {
    if (companyInfoData) {
      if (companyInfoData.freeDiskSpace === companyInfoData.totalDiskSpace) return 100;
      let onePercent = companyInfoData.totalDiskSpace / 100;
      let percentage = this.round(companyInfoData.freeDiskSpace / onePercent);
      return percentage;
    }
    return 0;
  }

  
  private getCompanyInfo(companyId: string): Promise<Company> {
    return this.httpService.get("/groups/" + companyId, null);
  }

  private round(value, precision?) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  private formattedValue(val: any, format: string) {
    return formatDate(val, format, 'en');
  }

}
