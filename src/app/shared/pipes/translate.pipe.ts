import { Pipe, PipeTransform,OnDestroy, Injectable} from '@angular/core';
import {TranslationService} from '../../core/services/translation.service'


@Pipe({
  name: 'translate',
  pure: false
})
@Injectable({
  providedIn: 'root'
})

export class TranslatePipe implements PipeTransform, OnDestroy {
  constructor(private ts:TranslationService){}


  transform(value: string): string {
      return this.ts.translate(value);
  }

  ngOnDestroy() {
  }
}
