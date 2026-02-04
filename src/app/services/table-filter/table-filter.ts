import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TableFilterService {
  private filterSubject = new Subject<string>();
  filter$ = this.filterSubject.asObservable();

  setFilter(value: string) {
    this.filterSubject.next(value);
  }
}
