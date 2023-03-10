import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnDestroy
} from "@angular/core";
import { Subscription } from "rxjs";
import { fromEvent, Observable } from "rxjs";
import { debounceTime, throttleTime } from "rxjs/operators";

@Directive({
  selector: "[calcHeight]",
})

/**
 *  Directive to calculate the height of the container based window size - top offset - constant offset
 */
export class CalcHeightDirective implements AfterViewInit, OnDestroy {

  @Input("calcHeight") topOffset: number;
  @Input("minHeight") minHeight: number;

  private _domElement: HTMLElement;
  private _subscription$: Subscription;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    this._domElement = this.elementRef.nativeElement as HTMLElement;

    // register on window resize event
    this._subscription$ = fromEvent(window, "resize")
      .pipe(throttleTime(0), debounceTime(200))
      .subscribe(() => this.setHeight());
  }

  ngAfterViewInit() {
    this.setHeight();
  }
  ngOnDestroy() {
    this._subscription$.unsubscribe();
  }

  private setHeight() {
    const windowHeight = window?.innerHeight;
    const topOffset = this.topOffset || this.calcTopOffset();
    let height = windowHeight - topOffset - 100;
    // set min height instead of the calculated
    if (this.minHeight && height < this.minHeight) {
      height = this.minHeight;
    }
    this.renderer.setStyle(this._domElement, "height", `${height}px`);
  }


  private calcTopOffset(): number {
    try {
      const rect = this._domElement.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return rect.top + scrollTop;
    } catch (e) {
      return 0;
    }
  }
}