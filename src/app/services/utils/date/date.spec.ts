import { TestBed } from '@angular/core/testing';

import { DateService } from './date';
import { provideZoneChangeDetection } from '@angular/core';

describe('DateService', () => {
  let service: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        DateService,
        provideZoneChangeDetection(),
      ]
    });
    service = TestBed.inject(DateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
