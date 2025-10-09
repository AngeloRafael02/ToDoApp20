import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class String {
  
  public insertArrayAtIndex(mainArray:string[], insertArray:string[], index:number):string[] {
    if (index < 0 || index > mainArray.length) {
      return mainArray;
    }
    const result:string[] = [
      ...mainArray.slice(0, index),
      ...insertArray,
      ...mainArray.slice(index),
    ];
    return result;
  }

  public capitalizeFirstLetter(str:string):string {
    if (str.length === 0) {
      return ""; // Handle empty strings
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
}
