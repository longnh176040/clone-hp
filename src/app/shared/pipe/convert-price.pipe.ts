import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertPrice'
})
export class ConvertPricePipe implements PipeTransform {

  transform(value: unknown): string {
    return value.toString().split("").reverse().join("").match(/.{1,3}/g).join(".").split("").reverse().join("");
  }

}
