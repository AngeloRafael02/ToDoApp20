import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BackendService } from '../backend/backend';
import { snackbarConfig } from '../../config/snackbar.config';
import { categoriesInterface,conditionInterface,ConfigType,threatInterface } from '../../interfaces/forms.interface';

@Injectable({
  providedIn: 'root'
})
export class DropdownDataService {

  private readonly STORAGE_KEYS = {
    categories: 'categories',
    statuses: 'statuses',
    threatLevels: 'threatLevels'
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private snackBar: MatSnackBar,
    private backendService:BackendService
  ) {}

  private categoriesSubject = new BehaviorSubject<categoriesInterface[] | null>(null);
  private statusesSubject = new BehaviorSubject<conditionInterface[] | null>(null);
  private threatLevelsSubject = new BehaviorSubject<threatInterface[] | null>(null);

  public categories$: Observable<categoriesInterface[] | null> = this.categoriesSubject.asObservable();
  public statuses$: Observable<conditionInterface[] | null> = this.statusesSubject.asObservable();
  public threatLevels$: Observable<threatInterface[] | null> = this.threatLevelsSubject.asObservable();

  public setCategories(data: categoriesInterface[]): void {
    this.categoriesSubject.next(data);
    this.syncToStorage(this.STORAGE_KEYS.categories, data);
  }

  public setStatuses(data: conditionInterface[]): void {
    this.statusesSubject.next(data);
    this.syncToStorage(this.STORAGE_KEYS.statuses, data);
  }

  public setThreatLevels(data: threatInterface[]): void {
    this.threatLevelsSubject.next(data);
    this.syncToStorage(this.STORAGE_KEYS.threatLevels, data);
  }

  public callAPIforData(){
    forkJoin({
      categories: this.backendService.getDropdownOptions<categoriesInterface[]>('categories'),
      status: this.backendService.getDropdownOptions<conditionInterface[]>('status'),
      threats: this.backendService.getDropdownOptions<threatInterface[]>('threats'),
    }).subscribe({
      next: (result) => {
        this.setCategories(result.categories.data);
        this.setStatuses(result.status.data);
        this.setThreatLevels(result.threats.data);
      },
      error: (err) => {
        const message:string = 'Failed to load dropdowns';
        this.snackBar.open(message, 'Dismiss', snackbarConfig);
        console.error(message, err);
      }
    });
  }

  private syncToStorage(key: string, data: unknown[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  private getFromStorage(key: string): any | null {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  public getCurrentData(type: ConfigType): any[] | null {
    if (type === this.STORAGE_KEYS.categories) return this.categoriesSubject.getValue();
    if (type === this.STORAGE_KEYS.statuses) return this.statusesSubject.getValue();
    if (type === this.STORAGE_KEYS.threatLevels) return this.threatLevelsSubject.getValue();
    return null;
  }

  public updateColor(type: ConfigType, updatedRow: any): void {
    let currentData: any[] | null = null;

    if (type === this.STORAGE_KEYS.categories) currentData = this.categoriesSubject.value;
    if (type === this.STORAGE_KEYS.statuses) currentData = this.statusesSubject.value;
    if (type === this.STORAGE_KEYS.threatLevels) currentData = this.threatLevelsSubject.value;

    if (currentData) {
      const updatedData = currentData.map(item =>
        item.id === updatedRow.id ? { ...item, color: updatedRow.color } : item
      );

      if (type === this.STORAGE_KEYS.categories) this.setCategories(updatedData);
      if (type === this.STORAGE_KEYS.statuses) this.setStatuses(updatedData);
      if (type === this.STORAGE_KEYS.threatLevels) this.setThreatLevels(updatedData);
      this.snackBar.open('Color Update Succesfull!', 'Dismiss', snackbarConfig);
    }
  }

  public initializeDropdownData(): void {
    const localCats = this.getFromStorage(this.STORAGE_KEYS.categories);
    const localStats = this.getFromStorage(this.STORAGE_KEYS.statuses);
    const localThreats = this.getFromStorage(this.STORAGE_KEYS.threatLevels);

    if (localCats && localStats && localThreats) {
      this.categoriesSubject.next(localCats);
      this.statusesSubject.next(localStats);
      this.threatLevelsSubject.next(localThreats);
    } else {
      this.callAPIforData();
    }
  }

  /**for Development only */
  public clearStoredData(): void {
    if (isPlatformBrowser(this.platformId)) {
      Object.values(this.STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
      this.categoriesSubject.next(null);
      this.statusesSubject.next(null);
      this.threatLevelsSubject.next(null);
      console.warn('Dropdown Service: Local storage and state have been cleared.');
    }
  }
}
