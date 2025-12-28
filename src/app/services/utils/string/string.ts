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

  public rearrangeArrayItem(arr: string[], targetValue: string, newIndex: number): string[] {
  const currentIndex = arr.indexOf(targetValue);
  if (currentIndex === -1) {
    return arr;
  }
  
  const [removedItem] = arr.splice(currentIndex, 1);
  arr.splice(newIndex, 0, removedItem);
  return arr;
}

  public capitalizeFirstLetter(str:string):string {
    if (str.length === 0) {
      return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
}
