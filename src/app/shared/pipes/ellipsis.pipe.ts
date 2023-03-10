import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'ellipsis' })
export class EllipsisPipe implements PipeTransform {
  transform(text: string="", limit: number = 5) {
    if(text.length <= limit)
      return text;
    return text.substring(0, limit) + '...';
  }
}