import { OnDestroy, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertBytesToGB'
})
export class ConvertBytesToGBPipe implements PipeTransform, OnDestroy {

  transform(value: number, decimal: number): any {
    return this.formatBytes(value, decimal);
  }

  formatBytes(bytes, decimal = 0) {
    var marker = 1024; // Change to 1000 if required
    var gigaBytes = marker * marker * marker; // One GB is 1024 MB
    return (bytes / gigaBytes).toFixed(decimal);
  }

  ngOnDestroy() { }

}
