import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exceptValue'
})
export class ExceptValuePipe implements PipeTransform {

  transform(value: string | number | undefined, ...args: unknown[]): unknown {
    if(value == 'null' || value == 'undefined' || !value) return ''
    else return value
  }

}
