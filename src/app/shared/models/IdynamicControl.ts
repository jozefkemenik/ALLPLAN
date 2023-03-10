import { EcontrolType } from "./EcontrolType.enum";
import { Validators  } from '@angular/forms';

export interface IdynamicControl {
  id: string;
  key: string | number;
  label: string; //translation
  type: EcontrolType;
  maxLength?: number;
  isExpanded?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  items?:Array<any>;
  titleInline?:boolean,
  validators?:Array<any>
}