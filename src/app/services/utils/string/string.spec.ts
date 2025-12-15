import { TestBed } from '@angular/core/testing';

import { String } from './string';

describe('String', () => {
  let service: String;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(String);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
