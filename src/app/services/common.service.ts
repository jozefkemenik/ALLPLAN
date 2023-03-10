import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { FormatWidth, getLocaleDateFormat, getLocaleDateTimeFormat, getLocaleTimeFormat } from '@angular/common';

@Injectable({
    providedIn: 'root'
  })
export class CommonService {

  public getLocaleDateTimeFormat(localeId) {

   // ToDo: Angular short datetime format differs from javascript Intl short datetime format
    //
    // e.g. 2001-03-04 05:06:07 with 'en' locale   
    //    Angular: 3/4/01, 5:06 AM
    // Javascript: 3/4/2001, 5:06:07 AM
    //
    // so currently the javascript one is used, but if PO decides for the Angular one, we can switch it.


    var customDate = new Date(2001, 2, 4, 5, 6, 7, 8);
    var localeDateFormat = customDate.toLocaleString(this.locale)
                                     .replace("2001","yyyy")
                                     .replace("01","yy")
                                     .replace("03","MM")
                                     .replace("3","M")
                                     .replace("04","dd")
                                     .replace("4","d")
                                     .replace("05","hh")
                                     .replace("5","h")
                                     .replace("06","mm")
                                     .replace("6","m")
                                     .replace("07","ss")
                                     .replace("06","mm")
                                     .replace("AM","a")
                                     ;

    
    // var dateFormat = getLocaleDateFormat(this.locale, FormatWidth.Short);
    // var timeFormat = getLocaleTimeFormat(this.locale, FormatWidth.Short);
    // var dateTimeFormat = getLocaleDateTimeFormat(this.locale, FormatWidth.Short);
    
    // var localeDateFormat = dateTimeFormat.replace("{1}", dateFormat).replace("{0}", timeFormat);   
    

    return localeDateFormat;

  }

  constructor(@Inject(LOCALE_ID) public locale: string,) { }

}