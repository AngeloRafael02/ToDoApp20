import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  public dateFormatHelper(deadline: string | null | undefined): string {
    if (!deadline || deadline.trim() === '') {
      return '';
    }
    return deadline.toString().slice(0, 10);
  }

}
