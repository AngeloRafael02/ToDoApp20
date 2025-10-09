import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Style {

  public ModifyThreatLevelCellColor(threat:string){
    switch (threat){
      case 'Low': 
        return 'greenCell';
      case 'Medium': 
        return 'yellowCell';
      case 'High': 
        return 'greenCell';
      case 'Alarming': 
        return 'redCell';
      case 'Inevitable': 
        return 'aquaCell';
      default: return 'whiteCell'
    }
  }

  public ModifyStatusCellColor(status:string) {
    switch (status){
      case 'Unfinished': 
        return 'greyCell';
      case 'In Progress': 
        return 'yellowCell';
      case 'Finished': 
        return 'greenCell';
      case 'Cancelled': 
        return 'redCell';
      case 'Delayed': 
        return 'aquaCell';
      case 'Continuous': 
        return 'lightblueCell';
      case 'On Hold': 
        return 'coralCell';
      case 'Speculation': 
        return 'bluevioletCell';
      default: return 'whiteCell'
    }
  }

  public RowColorPerDeadline(date:Date){
    const dateString:Date = date
    if (dateString == null) {
      return 'whiteRow';
    }
    
    const inputDate:Date = new Date(dateString);
    inputDate.setHours(0, 0, 0, 0);
    const today:Date = new Date();
    today.setHours(0, 0, 0, 0);
    const timeDifference:number = today.getTime() - inputDate.getTime();
    const daysDifference:number = timeDifference / (1000 * 60 * 60 * 24);
  
    if (daysDifference === 0) {
      return 'redRow';
    } else if (daysDifference >= -5 && daysDifference < 0) {
      return 'orangeRow';
    } else if (daysDifference < -5) {
      return 'greenRow';
    } else if (daysDifference >= 1) {
      return 'blackRow';
    } else {
      return 'whiteRow';
    }
  }
}
