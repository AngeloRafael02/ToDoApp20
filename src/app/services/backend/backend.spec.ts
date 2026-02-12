import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http'; // Required
import { provideHttpClientTesting } from '@angular/common/http/testing'; // For mocking
import { provideZonelessChangeDetection } from '@angular/core';
import { BackendService } from './backend';

describe('BackendService', () => {
  let service: BackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        BackendService
      ]
    });
    service = TestBed.inject(BackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});