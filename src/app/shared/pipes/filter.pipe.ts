import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(values: any[], ...args: any[]): unknown {
    const type = Number(args[0]);
    const search = args[1];
    const maxLength = type === 1 ? 1 : 2;
    if (search.length > maxLength) {
      switch (type) {
        case 1:
          return values.filter((x) => x.contract_number.toString().includes(search.toLowerCase()));
        case 2:
          return values.filter((x) => x.description.toLowerCase().includes(search.toLowerCase()));
      }
    }
    return values;


  }

}
