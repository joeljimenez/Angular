import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxLength'
})
export class MaxLengthPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value !=null){
      if(value.length > args){
        return value.substring(0, args) + "";
      } else {
        return value;
      }
    }    
    return null;
  }

}
