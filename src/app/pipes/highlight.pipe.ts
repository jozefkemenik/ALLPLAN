import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})

@Injectable()
export class HighlightPipe implements PipeTransform {

  constructor(private _sanitizer: DomSanitizer) { }

  transform(list: any, highlightText: string, highlightColumns: string, columnName: string): any {


    if (!list) { return []; }
    if (!highlightText || !highlightColumns || !columnName) { return list; }
    if (highlightColumns && columnName && highlightColumns.toLowerCase().indexOf('|' + columnName.toLowerCase() + '|') == -1) { return list; }

    //ToDo: must be reworked when the serach term will be split by space or underscore characters
    var regSpecialChars = new RegExp('([\\.\\^\\$\\*\\+\\-\\?\\(\\)\\[\\]\\{\\}\\\\\\|\\/]{1})', 'gi');
    var reg = new RegExp(`(${highlightText.replace(regSpecialChars, '\\$1')})`, 'gi');
    
    const value = ("" + list).replace(reg, '<mark>$1</mark>');

    return this._sanitizer.bypassSecurityTrustHtml(value);
  }
}