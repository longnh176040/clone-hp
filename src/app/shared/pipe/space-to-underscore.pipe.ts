import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spaceToUnderscore'
})
export class SpaceToUnderscorePipe implements PipeTransform {
  transform(value: string) {
    if(value){
      return value.trim().split(' ').join('_');
    }else{
      return null;
    }
  }
}
