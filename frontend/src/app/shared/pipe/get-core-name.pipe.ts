import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getCoreName'
})
export class GetCoreNamePipe implements PipeTransform {

  transform(value: string, type: string): string {
    let first_str = value.trim().split(' ').join('').toLowerCase();
    if (type == 'CPU') {
      if (first_str.includes('core')) {
        let core_index = first_str.indexOf('core') + 4;
        first_str = first_str.slice(core_index);
        let i_index = first_str.indexOf('i');
        return 'core ' + first_str.slice(i_index, i_index + 2);
      } else {
        let ryzen_index = first_str.indexOf('ryzen') +5;
        first_str = first_str.slice(ryzen_index);
        let series_index = first_str.match(/\d+/).shift();
        return 'ryzen ' + series_index[0];
      }
    } 
    
    else if (type == 'RAM') {
        if (first_str.includes('4gb')) return '4gb'
        else if (first_str.includes('8gb')) return '8gb'
        else if (first_str.includes('16gb')) return '16gb'
    } 
    
    else if (type == 'storage') {
      if (first_str.includes('ssd')) {
        if (first_str.includes('128gb')) return '128gb'
        else if (first_str.includes('256gb')) return '256gb'
        else if (first_str.includes('512gb')) return '512gb'
      } else if (first_str.includes('hdd')) {
        return '1tb'
      }
    } 
    
    else if (type == 'graphic') {
      if (first_str.includes('intel')) return 'onboard'
      else if (first_str.includes('amd')) return 'amd'
      else if (first_str.includes('nvidia')) return 'nvidia'
    } 
    
    else if (type == 'display') {
      let inch_index = first_str.indexOf('inch');
      first_str = first_str.slice(0, inch_index);
      let num_str = first_str.slice(-4);
      if(num_str.includes('.')) return num_str + ' inch'
      else return num_str.slice(-2) + ' inch'
    }
  }

}
