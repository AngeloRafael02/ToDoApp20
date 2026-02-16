import { TestBed } from '@angular/core/testing';
import { StringService } from './string';
import { provideZonelessChangeDetection } from '@angular/core';

describe('StringService', () => {
  let service: StringService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StringService,
        provideZonelessChangeDetection(),
      ]
    });
    service = TestBed.inject(StringService);
  });

  describe('insertArrayAtIndex', () => {
    it('should insert an array into the middle of another array', () => {
      const main = ['a', 'd'];
      const insert = ['b', 'c'];
      const result = service.insertArrayAtIndex(main, insert, 1);
      expect(result).toEqual(['a', 'b', 'c', 'd']);
    });

    it('should return original array if index is out of bounds', () => {
      const main = ['a', 'b'];
      const result = service.insertArrayAtIndex(main, ['c'], 5);
      expect(result).toEqual(['a', 'b']);
    });
  });

  describe('rearrangeArrayItem', () => {
    it('should move an item to a new index (mutates original)', () => {
      const arr = ['apple', 'banana', 'cherry'];
      // Move 'apple' to index 1
      service.rearrangeArrayItem(arr, 'apple', 1);
      expect(arr).toEqual(['banana', 'apple', 'cherry']);
    });

    it('should return unchanged array if targetValue is not found', () => {
      const arr = ['a', 'b'];
      const result = service.rearrangeArrayItem(arr, 'z', 1);
      expect(result).toEqual(['a', 'b']);
    });
  });

  describe('capitalizeFirstLetter', () => {
    it('should capitalize the first character', () => {
      expect(service.capitalizeFirstLetter('hello')).toBe('Hello');
    });

    it('should return an empty string if input is empty', () => {
      expect(service.capitalizeFirstLetter('')).toBe('');
    });
  });

  describe('titlecase', () => {
    it('should convert a sentence to Title Case', () => {
      expect(service.titlecase('angular is awesome')).toBe('Angular Is Awesome');
    });

    it('should handle messy casing correctly', () => {
      expect(service.titlecase('jAVasCrIPt rOCKS')).toBe('Javascript Rocks');
    });

    it('should handle multiple spaces between words', () => {
      // Your service logic: words.map(word => if (word.length === 0) return word)
      // This results in double spaces being preserved.
      expect(service.titlecase('hello  world')).toBe('Hello  World');
    });
  });
});