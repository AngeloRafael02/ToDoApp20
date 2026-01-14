import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StyleService {

  public categoryCellColors:string[] = [
   "#8EECF5",
   "#98F5E1",
   "#90DFB4",
   "#B9FBC0",
   "#FBF8CC",
   "#FDE4CF",
   "#FFCFD2",
   "#F1C0E8",
   "#CFBAF0",
   "#A3C4F3",
  ];

  public statusCellColors:string[] = [
    "#BFBFBF",
    "#FBF8CC",
    "#90DFB4",
    "#FFCFD2",
    "#FDE4CF",
    "#8EECF5",
    "#F1C0E8",
    "#CFBAF0",
  ];

  public threatCellColors:string[] = [
    "#B9FBC0",
    "#FBF8CC",
    "#FDE4CF",
    "#FFCFD2",
    "#A9A9A9",
  ];

  public PriorityColor(prio: number | null): string {
    if (prio === null || prio > 10) return '#FCDEF0';
    if (prio < 2)  return '#FCDEF0';
    if (prio <= 5) return '#FCE8D2';
    return '#D6ECD2';
  }

  public RowColorPerDeadline(dateInput: any): string {
    if (!dateInput) return '#F5F5F5';
    const deadline = new Date(dateInput);
    deadline.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0)  return '#BFBFBF';
    if (diffDays === 0) return '#FCDEF0';
    if (diffDays <= 5)  return '#FCE8D2';
    return '#D6ECD2';
  }
}
