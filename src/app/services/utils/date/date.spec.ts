import { TestBed } from '@angular/core/testing';
import { DateService } from './date';
import { provideZonelessChangeDetection } from '@angular/core';

describe('DateService', () => {
  let service: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DateService,
        provideZonelessChangeDetection(),
      ]
    });
    service = TestBed.inject(DateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('dateFormatHelper', () => {
    
    it('should return the first 10 characters of a valid date string', () => {
      const fullDate = '2026-12-25T14:30:00Z';
      const result = service.dateFormatHelper(fullDate);
      expect(result).toBe('2026-12-25');
    });

    it('should return an empty string if input is null', () => {
      expect(service.dateFormatHelper(null)).toBe('');
    });

    it('should return an empty string if input is undefined', () => {
      expect(service.dateFormatHelper(undefined)).toBe('');
    });

    it('should return an empty string if input is just whitespace', () => {
      expect(service.dateFormatHelper('   ')).toBe('');
    });

    it('should handle short strings correctly (less than 10 chars)', () => {
      // slice(0, 10) on a 4-char string just returns the 4 chars
      expect(service.dateFormatHelper('2026')).toBe('2026');
    });

    it('should return an empty string for an empty string input', () => {
      expect(service.dateFormatHelper('')).toBe('');
    });
    
  });
});