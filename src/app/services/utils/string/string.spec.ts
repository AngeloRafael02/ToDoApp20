import { TestBed } from '@angular/core/testing';

import { StringService } from './string';
import { provideZoneChangeDetection } from '@angular/core';

describe('String', () => {
  let service: StringService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        StringService,
        provideZoneChangeDetection()
      ]
    });
    service = TestBed.inject(StringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
