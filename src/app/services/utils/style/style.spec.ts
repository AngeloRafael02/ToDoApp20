import { TestBed } from '@angular/core/testing';
import { StyleService } from './style';
import { provideZonelessChangeDetection } from '@angular/core';

describe('StyleService', () => {
  let service: StyleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StyleService,
        provideZonelessChangeDetection()
      ]
    });
    service = TestBed.inject(StyleService);
  });

  describe('PriorityColor', () => {
    it('should return pink (#FCDEF0) for null, high numbers (>10), or very low numbers (<2)', () => {
      expect(service.PriorityColor(null)).toBe('#FCDEF0');
      expect(service.PriorityColor(11)).toBe('#FCDEF0');
      expect(service.PriorityColor(1)).toBe('#FCDEF0');
    });

    it('should return peach (#FCE8D2) for medium priority (2-5)', () => {
      expect(service.PriorityColor(2)).toBe('#FCE8D2');
      expect(service.PriorityColor(5)).toBe('#FCE8D2');
    });

    it('should return green (#D6ECD2) for low priority (6-10)', () => {
      expect(service.PriorityColor(6)).toBe('#D6ECD2');
      expect(service.PriorityColor(10)).toBe('#D6ECD2');
    });
  });

  describe('RowColorPerDeadline', () => {
    beforeEach(() => {
      // Freeze "today" to a specific date: Jan 10, 2024
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date('2024-01-10T12:00:00'));
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should return grey for past deadlines', () => {
      const pastDate = '2024-01-09';
      expect(service.RowColorPerDeadline(pastDate)).toBe('#BFBFBF');
    });

    it('should return pink for deadlines today', () => {
      const todayDate = '2024-01-10';
      expect(service.RowColorPerDeadline(todayDate)).toBe('#FCDEF0');
    });

    it('should return peach for deadlines within 5 days', () => {
      const upcomingDate = '2024-01-15'; // Exactly 5 days away
      expect(service.RowColorPerDeadline(upcomingDate)).toBe('#FCE8D2');
    });

    it('should return green for far-off deadlines', () => {
      const farDate = '2024-01-16'; // 6 days away
      expect(service.RowColorPerDeadline(farDate)).toBe('#D6ECD2');
    });
  });

  describe('getContrastText', () => {
    it('should return black for light colors', () => {
      expect(service.getContrastText('#FFFFFF')).toBe('black'); // White background
      expect(service.getContrastText('#D6ECD2')).toBe('black'); // Light green
    });

    it('should return white for dark colors', () => {
      expect(service.getContrastText('#000000')).toBe('white'); // Black background
      expect(service.getContrastText('#333333')).toBe('white'); // Dark grey
    });
  });
});