import { TestBed } from '@angular/core/testing';
import { TableFilterService } from './table-filter';
import { provideZonelessChangeDetection } from '@angular/core';

describe('TableFilterService', () => {
  let service: TableFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideZonelessChangeDetection(),
      ]
    });
    service = TestBed.inject(TableFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
