import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { ILanguage } from '../models/ILanguage';
import { Observable, Subject } from 'rxjs';
import { Router, } from '@angular/router';
const Excel = require('exceljs');

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  dictionary: object;
  private _language: ILanguage;
  public languages: Array<ILanguage>;
  // this should be replace with API, with http service instead httpClient
  private readonly translationsUrl = '/assets/translations.json';
  public change$: Subject<string>



  constructor(private http: HttpClient, private router: Router, private httpService: HttpService) {
    this.change$ = new Subject();
    this.languages = [
      { icon: "en", text: "english", linkId: 0 }
      , { icon: "de", text: "german", linkId: 1 }
      // , { icon: "cs", text: "czech", linkId: 3 }
      // , { icon: "it", text: 'italien', linkId: 2 }
      // , { icon: "es", text: 'spanish', linkId: 18 }
      // , { icon: "fr", text: 'french', linkId: 4 }
    ];
    var strlang = this.httpService.getParameterByName('l');
    if (!strlang) {
      strlang = localStorage.getItem("language");
    }
    if (strlang && this.languages.some(le => strlang == le.icon)) {
      this.language = this.languages.find(le => strlang == le.icon);

    } else {
      // set english at default
      this.language = this.languages[0];
    }
  }

  public init(): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
      this.http.get(this.translationsUrl)
        .toPromise()
        .then((r) => {
          this.dictionary = r;

          res(true)
        },
          (err) => { rej(err) }
        )
    })
  }


  translate(key: string): string {
    if (key && key.length > 0) {
      return this.dictionary &&
        this.dictionary[this._language.icon] &&
        this.dictionary[this._language.icon][key] ? this.dictionary[this._language.icon][key] : key;
    }
    return "";
  }


  set language(key: ILanguage) {
    this._language = key;
    var l = this._language.icon;
    localStorage.setItem('language', l)
    this.change$.next(l);
  }

  get language(): ILanguage {
    return this._language;
  }



  /**
   * Export tranation.json into multipe excel files
   */
  exportXlsFiles() {
    for (var lang in this.dictionary) {
      this.makeXlsFile(lang);
    }
  }



  public makeXlsFile(lang) {
    if (!this.languages.some(s => s.icon == lang)) {
      return;
    }
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(lang);
    const dic = this.dictionary[lang];
    this.makeXlsColumns(worksheet, dic);
    this.createFile(workbook, lang);
  }

  private makeXlsColumns(worksheet: any, dic: any) {
    worksheet.columns = [
      { header: 'KEY', key: 'key', width: 80 },
      { header: 'VALUE', key: 'value', width: 100 }];
    for (var key in dic) {
      worksheet.addRow({
        key: key, value: dic[key]
      });
    }
  }

  private createFile(workbook: any, lang: string) {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const fileExtension = '.xlsx';
    workbook
      .xlsx
      .writeBuffer()
      .then((buffer) => {
        const blob = new Blob([buffer], { type: fileType });
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = "export-allplan-" + lang + fileExtension;
        a.click();
        a.remove();
      })
      .catch((err) => {
        console.log("err", err);
      });
  }



  read(file: File): Promise<Array<string>> {
    const logs = [];
    return new Promise<Array<string>>((res, rej) => {
      const wb = new Excel.Workbook();
      var reader = new FileReader();
      reader.onload = (event: any) => {
        const buffer = reader.result;
        wb.xlsx.load(buffer).then(workbook => {
          logs.push('opening file')  
          workbook.eachSheet((sheet, id) => {
            logs.push('detecteding language: ' + sheet.name);
            if (sheet.name && this.languages.some(s => s.icon == sheet.name)) {
              var indexKey = -1, indexValue = 1;
              logs.push('reading sheet')
              const dic = this.dictionary[sheet.name];
              sheet.eachRow((row, rowIndex) => {
                if (rowIndex == 1) {
                  indexKey = (<Array<string>>row.values).indexOf('KEY');
                  indexValue = (<Array<string>>row.values).indexOf('VALUE');
                }
                else {
                  if (indexKey > -1 && indexValue > -1) {
                    const key = row.values[indexKey];
                    const value = row.values[indexValue];
                    if (!dic[key] || dic[key] != value) {
                      logs.push("updating " + key + ": " + dic[key] + " --> " + value)
                      dic[key] = value;
                    }
                  }
                }
              })
              logs.push('sheet done')
            }
            
          })
          logs.push('file completed')
          
         res(logs);
        })
      }
      reader.readAsArrayBuffer(file)
    })
  }


  exportJson() {
    var strLogs = JSON.stringify(this.dictionary)
    if (strLogs) {
      var a = document.createElement("a");
      a.href = window.URL.createObjectURL(new Blob([strLogs], { type: "text/plain" }));
      a.download = "translations.json";
      a.click();
      a.remove();
    }
  }




}
