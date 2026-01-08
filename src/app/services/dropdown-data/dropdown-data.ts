import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { categoriesInterface,conditionInterface,threatInterface } from '../../interfaces/forms.interface';

@Injectable({
  providedIn: 'root'
})
export class DropdownDataService {
  private categoriesSubject = new BehaviorSubject<categoriesInterface[] | null>(null);
  private statusesSubject = new BehaviorSubject<conditionInterface[] | null>(null);
  private threatLevelsSubject = new BehaviorSubject<threatInterface[] | null>(null);

  public categories$: Observable<categoriesInterface[] | null> = this.categoriesSubject.asObservable();
  public statuses$: Observable<conditionInterface[] | null> = this.statusesSubject.asObservable();
  public threatLevels$: Observable<threatInterface[] | null> = this.threatLevelsSubject.asObservable();

  public setCategories(data: categoriesInterface[]): void {
    this.categoriesSubject.next(data);
  }

  public setStatuses(data: conditionInterface[]): void {
    this.statusesSubject.next(data);
  }

  public setThreatLevels(data: threatInterface[]): void {
    this.threatLevelsSubject.next(data);
  }
}
