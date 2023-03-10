import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { interval } from 'rxjs';
import { map, take } from 'rxjs/operators';

export class ProgressBarAnimated {
  tagWidth: number; //div width
  tagMaxWidth: number // base on percentage
  tagHeight: number; //div width
  totalWidth: number;
  freeWidth: number;
  innerText?: string;
  bottomText?: string; //value under progress bar on right
  countSteps: number;
  oneStepWidth: number;
  percentage: number;
}

@Component({
  selector: 'ap-progress-bar-animated',
  templateUrl: './progress-bar-animated.component.html',
  styleUrls: ['./progress-bar-animated.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProgressBarAnimatedComponent implements OnInit {

  @Input() data: ProgressBarAnimated;
  source: any;
  counter$: any;

  count: number = 0;
  percentageDone: number;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.buildProgressBar();
  }

  buildProgressBar() {
    this.source = interval(20);

    this.counter$ = this.source.pipe(
      take(this.data.countSteps), //how many times he will do counting
      map((value: number) => {
        this.percentageDone = value;
        return this.count = this.data.oneStepWidth * value;
      })
    );

    this.counter$.subscribe(data => {
      this.count = 0;
    });
  }

}
