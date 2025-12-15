import { TestBed } from '@angular/core/testing';

import { DropdownData } from './dropdown-data';

describe('DropdownData', () => {
  let service: DropdownData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropdownData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
