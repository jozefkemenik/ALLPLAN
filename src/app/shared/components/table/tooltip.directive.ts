import { Directive, ElementRef, HostListener, Inject, Input, NgZone, Optional, ViewContainerRef } from '@angular/core';
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MAT_TOOLTIP_SCROLL_STRATEGY,
  MatTooltip,
  MatTooltipDefaultOptions
} from '@angular/material/tooltip';
import { AriaDescriber, FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { Overlay, ScrollDispatcher } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appTooltip]'
})

// This directive only shows tooltip when table cell text is larger than the containing element itself

export class ToolTipDirective extends MatTooltip {

  @Input()
  get appTooltip() {
    return this.message;
  }
  set appTooltip(txt: string) {
    this.message = txt;
  }

  constructor(private el: ElementRef,
    _overlay: Overlay,
    _scrollDispatcher: ScrollDispatcher,
    _viewContainerRef: ViewContainerRef,
    _ngZone: NgZone,
    _platform: Platform,
    _ariaDescriber: AriaDescriber,
    _focusMonitor: FocusMonitor,
    @Inject(MAT_TOOLTIP_SCROLL_STRATEGY) _scrollStrategy: any,
    @Optional() _dir: Directionality,
    @Optional() @Inject(MAT_TOOLTIP_DEFAULT_OPTIONS)
    _defaultOptions: MatTooltipDefaultOptions,
    @Inject(DOCUMENT) _document: any,
  ) {

    super(
      _overlay,
      el,
      _scrollDispatcher,
      _viewContainerRef,
      _ngZone,
      _platform,
      _ariaDescriber,
      _focusMonitor,
      _scrollStrategy,
      _dir,
      _defaultOptions,
      _document
    );
  }

  @HostListener('mouseenter')
  check(): void {
    this.disabled = (this.el.nativeElement.offsetWidth < this.el.nativeElement.scrollWidth) ? false : true;
  }

}