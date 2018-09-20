import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'routename',
  pure: false
})
export class RouteNamePipe implements PipeTransform {

  transform(value: string): string {
    return value === '/favorites' ? 'favorites' : 'home';
  }

}
