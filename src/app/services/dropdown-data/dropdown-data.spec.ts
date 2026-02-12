import { TestBed } from '@angular/core/testing';

import { DropdownDataService } from './dropdown-data';
import { provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('DropdownDataService', () => {
  let service: DropdownDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        DropdownDataService,
        provideZoneChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(DropdownDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
