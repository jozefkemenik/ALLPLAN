
import { EmptyTable } from '../../empty-section/empty-section.component';
import {formatDate} from '@angular/common';
import { TranslationService } from 'src/app/core/services/translation.service';

//defines a column types
interface IColumnConfigType {
    initialWidth?: string
    minimalWidth?: string;
    maximalWidth?: string;
    format?:string
    formattedValue(arg: any): any;
}

class FluidStr implements IColumnConfigType {
    formattedValue(val: any) {
        return val;
    }
}

class Str implements IColumnConfigType {
    formattedValue(val: any) {
        return val;
    }
}

class FileType implements IColumnConfigType {
    initialWidth = '50px';
    formattedValue(val: any) {
        return val;
    }
}

class ShortDate implements IColumnConfigType {
    initialWidth = '80px';
    maximalWidth = '80px';
    format='dd.MM.yyyy';
    formattedValue(val: any) {
        return  val != null ? formatDate(val, this.format, 'en') : null;
    }
}

class LongDate implements IColumnConfigType {
    minimalWidth = '50px'
    initialWidth = '140px';
    format='dd.MM.yyyy HH:mm:ss';
    formattedValue(val: any) {
        return  val != null ? formatDate(val, this.format, 'en') : null;
    }
}



class ShortNumber implements IColumnConfigType {
    minimalWidth = '50px';
    initialWidth = '140px';
    formattedValue(val: any) {
        return val+"";
    }
}

class LongNumber implements IColumnConfigType {
    formattedValue(val: any) {
        return val + 'Str';
    }
}

// class ActionDownload implements IColumnConfigType {
//     type:ETableAction.DOWNLOAD;
//     row:any=null;
//     tooltip = !this.row["downloadDate"] ? 'notDownloadedYet' : new LongDate().formattedValue(this.row["downloadDate"])
//     icon:string = "custom-download-icon";
//     class:string;
//     formattedValue(val: any) {
//         return val;
//     }
// }

export enum EColumnConfigType {
    FluidStr,
    Str,
    ShortDate,
    LongDate,
    FileType,
    ShortNumber,
    LongNumber,
    Any
}
export interface IColumnConfig {
    type?: EColumnConfigType;
    initialWidth?: string;
    minimalWidth?: string;
    maximalWidth?: string;
    key: string;
    header: string;
    css?: string;
    isLink?: boolean;
    canHighlight?: boolean;
    icon?: boolean;
    show?: boolean;
    sticky?:boolean;
    expandable?:boolean|FunctionRowBoolean;
    canSort?:boolean;
    inactive?:string; // some column in row can be active some disabled used for example in company member
}

export class ColumnConfig implements IColumnConfig {
    constructor(obj: IColumnConfig, private ts:TranslationService) {
        var instanceOfType
        switch (obj.type) {
            case EColumnConfigType.FluidStr: instanceOfType = new FluidStr(); break;
            case EColumnConfigType.Str: instanceOfType = new Str(); break;
            case EColumnConfigType.FileType: instanceOfType = new FileType(); break;
            case EColumnConfigType.ShortDate: instanceOfType = new ShortDate(); break;
            case EColumnConfigType.LongDate: instanceOfType = new LongDate(); break;
            case EColumnConfigType.ShortNumber: instanceOfType = new ShortNumber(); break;
            case EColumnConfigType.LongNumber: instanceOfType = new LongNumber(); break;
        }
        if (instanceOfType) {
            // copy properties from static type instance
            for (var prop in instanceOfType) {
                this[prop] = instanceOfType[prop];
            }
            if(instanceOfType.formattedValue) this.formattedValue = instanceOfType.formattedValue;

        }
        //copy properties from current config definition
        for (var prop in obj) {
            this[prop] = obj[prop];
        }
        this.setWidthBasedTextHeader()
        this.style= {'min-width':this.minimalWidth, 'width':this.initialWidth,
         'max-width':this.maximalWidth}
    }

    type?: EColumnConfigType = EColumnConfigType.Any;
    initialWidth: string ='50px';
    minimalWidth?: string='20px';
    maximalWidth?: string= '500px';
    key: string;
    header: string;
    css?: string;
    isLink?: boolean = false;
    canHighlight?: boolean = true;
    icon?: boolean = false;
    show?: boolean = true;
    style:any=null;
    value?:string;
    sticky=false;
    expandable?:boolean|FunctionRowBoolean;
    isExpandable(row:any):boolean{
        if (typeof this.expandable=== 'function') return (this.expandable as FunctionRowBoolean)(row)
        return this.expandable as boolean;
    }

    canSort=true;
    formattedValue(val: any) {
        return val;
    }
    private setWidthBasedTextHeader(){
        const headerWidth = this.measurewidth(this.ts.translate(this.header));
        let initWidth =  Number(this.initialWidth.replace(/\D/g, ''));
        //transform % to px
        if(this.initialWidth.includes('%')){
            initWidth =  Math.floor(window.innerWidth* (initWidth/100));
            this.initialWidth = initWidth+"px"
        }
        if(this.initialWidth!=='auto' && headerWidth>initWidth){
            this.initialWidth = headerWidth+'px';
        }

        if(this.sticky){
            this.minimalWidth=headerWidth+'px';
        }
    }
    private measurewidth(text) {
        var tag = document.createElement("div");
        tag.style.position = "absolute";
        tag.style.left = "-999em";
        tag.style.whiteSpace = "nowrap";
        tag.style.fontFamily="Arial"
        tag.style.fontSize="14px";
        tag.style.fontWeight="bold"
        tag.innerHTML = text;
        document.body.appendChild(tag);
        var calcWidth = tag.clientWidth;
        document.body.removeChild(tag);
        return calcWidth+12;
    }
}
interface ISort{
    key:string;
    direction:"asc"|"desc";
}
type FunctionRowBoolean = (row: any) => boolean;

export interface ITableConfig {
    pageSizeOptions: Array<number>;
    pageSizeIndex: number;
    tableContext: string;
    tableInstance: string;
    canSelectRows?: boolean;
    canExpandRows?: boolean;
    confColumns: Array<IColumnConfig>
    actions?: Array<string>;
    hasAction?:boolean;
    emptyTable?: EmptyTable;
    noActive?:boolean|FunctionRowBoolean;
    sort?:ISort;
}

export class TableConfig implements ITableConfig {
    constructor(config: ITableConfig, ts:TranslationService) {
        for (var c in config) {
            this[c] = config[c];
        }
        //populate columns property from confColumns property and set always auto width for last column
        this.columns = this.confColumns.map((r,i) => {

            if(i==this.confColumns.length-1){
                r.initialWidth='auto';
                r.minimalWidth='auto';
                r.maximalWidth='auto';
            }
            var res = new ColumnConfig(r, ts);

            return res;;
        })
    }
    pageSizeOptions = [5, 20, 50];
    pageSizeIndex = 1;
    tableContext = "";
    tableInstance = "";
    canSelectRows?= true;
    canExpandRows?= false;
    columns: Array<ColumnConfig> = [];
    // this is used in the configuration settings
    confColumns: Array<IColumnConfig>;
    actions?: Array<string> = [];
    emptyTable?: EmptyTable = new EmptyTable();
    sort?:ISort={key:null,direction:null};

    hasAction=true;
    noActive?:boolean|FunctionRowBoolean=false;

    isNoActive(row:any):boolean{
        if (typeof this.noActive === 'function') return (this.noActive as FunctionRowBoolean)(row)
        return this.noActive as boolean;
    }

    // this is for old implementation directive highligh
    get highlightColumns():string{
        return `|${this.columns.filter(c=>c.canHighlight).map(m=>m.key).join('|')}|`;
    }
}



