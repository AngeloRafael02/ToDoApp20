import { TestBed } from '@angular/core/testing';
import { DropdownDataService } from './dropdown-data';
import { BackendService } from '../backend/backend';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';

describe('DropdownDataService', () => {
  let service: DropdownDataService;
  let backendServiceSpy: jasmine.SpyObj<BackendService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const mockData = {
    categories: { status: 'success', data: [{ id: 1, name: 'Cat 1', color: 'red' }] },
    status: { status: 'success', data: [{ id: 1, status: 'Active', color: 'blue' }] },
    threats: { status: 'success', data: [{ id: 1, level: 'High', color: 'green' }] }
  };

  beforeEach(() => {
    const bSpy = jasmine.createSpyObj('BackendService', ['getDropdownOptions']);
    const sSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        DropdownDataService,
        provideZonelessChangeDetection(),
        { provide: BackendService, useValue: bSpy },
        { provide: MatSnackBar, useValue: sSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(DropdownDataService);
    backendServiceSpy = TestBed.inject(BackendService) as jasmine.SpyObj<BackendService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('API and Initialization', () => {
    it('should call API if localStorage is empty', () => {
      (backendServiceSpy.getDropdownOptions.and as any).callFake((option: string) => {
        if (option === 'categories') return of(mockData.categories);
        if (option === 'status') return of(mockData.status);
        return of(mockData.threats);
      });

      service.initializeDropdownData();

      expect(backendServiceSpy.getDropdownOptions).toHaveBeenCalledTimes(3);
      expect(service.getCurrentData('categories')).toEqual(mockData.categories.data);
    });

    it('should load from localStorage if data exists (no API call)', () => {
      localStorage.setItem('categories', JSON.stringify([{ id: 99, name: 'Local' }]));
      localStorage.setItem('statuses', JSON.stringify([{ id: 99, status: 'Local' }]));
      localStorage.setItem('threatLevels', JSON.stringify([{ id: 99, level: 'Local' }]));

      service.initializeDropdownData();

      expect(backendServiceSpy.getDropdownOptions).not.toHaveBeenCalled();
      const cats = service.getCurrentData('categories');
      expect(cats![0].id).toBe(99);
    });

    it('should show snackbar on API error', () => {
      backendServiceSpy.getDropdownOptions.and.returnValue(throwError(() => new Error('API Fail')));

      service.callAPIforData();

      expect(snackBarSpy.open).toHaveBeenCalledWith('Failed to load dropdowns', 'Dismiss', jasmine.any(Object));
    });
  });

  describe('Data Manipulation', () => {
    it('should update color and sync to storage', () => {
      service.setCategories([{ id: 1, name: 'Test', color: 'blue' }] as any);

      const update = { id: 1, color: 'yellow' };
      service.updateColor('categories', update);

      const current = service.getCurrentData('categories');
      expect(current![0].color).toBe('yellow');

      const stored = JSON.parse(localStorage.getItem('categories')!);
      expect(stored[0].color).toBe('yellow');

      expect(snackBarSpy.open).toHaveBeenCalledWith('Color Update Succesfull!', 'Dismiss', jasmine.any(Object));
    });
  });

  describe('Utility Functions', () => {
    it('should clear all data and subjects', (done) => {
      service.setCategories([{ id: 1 }] as any);
      service.clearStoredData();

      expect(localStorage.getItem('categories')).toBeNull();

      service.categories$.subscribe(val => {
        expect(val).toBeNull();
        done();
      });
    });
  });
});
