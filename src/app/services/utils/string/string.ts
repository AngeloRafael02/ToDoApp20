import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringService {

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

  public titlecase(str:string){
    str = str.toLowerCase();
    const words = str.split(' ');
    const titleCasedWords = words.map(word => {
      if (word.length === 0) return word; // Handle potential extra spaces
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return titleCasedWords.join(' ');
  }

}
