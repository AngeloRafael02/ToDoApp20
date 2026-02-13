import { TestBed } from '@angular/core/testing';

import { StyleService } from './style';
import { provideZonelessChangeDetection } from '@angular/core';

describe('StyleService', () => {
  let service: StyleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        StyleService,
        provideZonelessChangeDetection()
      ]
    });
    service = TestBed.inject(StyleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
