import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalcHeightDirective} from "./calc-height.directive";
import { NgInitDirective } from './init.directive';
import { DynamicIdDirective} from './dynamic-id.directive';


const directives = [
  CalcHeightDirective,
  NgInitDirective,
  DynamicIdDirective
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: directives,
  exports: directives
})
export class SharedDirectivesModule {}