import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EllipsisPipe } from "./ellipsis.pipe";
import { HighlightPipe } from "./highlight.pipe";
import { TranslatePipe } from "./translate.pipe";
import { HighlightTextPipe } from './highlightText.pipe';
import { ConvertBytesToGBPipe } from './convertBytes.pipe';

const pipes = [
  EllipsisPipe,
  HighlightPipe,
  TranslatePipe,
  HighlightTextPipe,
  ConvertBytesToGBPipe
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: pipes,
  exports: pipes
})
export class SharedPipesModule { }