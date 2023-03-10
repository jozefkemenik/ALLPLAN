import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight2'
})

@Injectable()
export class HighlightTextPipe implements PipeTransform {

  constructor(private _sanitizer: DomSanitizer) { }

  transform(list: any, highlightText: string): any {
    if (!list) { return []; }
    var regSpecialChars = new RegExp('([\\.\\^\\$\\*\\+\\-\\?\\(\\)\\[\\]\\{\\}\\\\\\|\\/]{1})', 'gi');
    var reg = new RegExp(`(${highlightText.replace(regSpecialChars, '\\$1')})`, 'gi');
    
    const value = ("" + list).replace(reg, '<mark>$1</mark>');
    return this._sanitizer.bypassSecurityTrustHtml(value);
  }
}