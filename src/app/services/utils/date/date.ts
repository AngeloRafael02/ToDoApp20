import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Date {

  public DateUndefinedConverter(value:Date | undefined):string{
    if (value) {
      return value.toString();
    }
    return "1970-01-01";
  }

  public dateFormatHelper(deadline:string):string{
    if (deadline == null){
      return  '';
    } else {
      return deadline || deadline.trim() !== '' ? deadline.toString().slice(0,10) : '';
    }
  }
}
