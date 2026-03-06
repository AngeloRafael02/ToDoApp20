import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { KeybindService } from './keybinds';

describe('KeybindService', () => {
  let service: KeybindService;
  const STORAGE_KEY = 'todo_app_keybinds';

  const mockLocalStorage = () => {
    let store: Record<string, string> = {};
    spyOn(localStorage, 'getItem').and.callFake(key => store[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key, value) => store[key] = value + '');
    spyOn(localStorage, 'removeItem').and.callFake(key => delete store[key]);
    spyOn(localStorage, 'clear').and.callFake(() => store = {});
  };

  describe('Browser Environment', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          KeybindService,
          { provide: PLATFORM_ID, useValue: 'browser' }
        ]
      });

      mockLocalStorage();
      localStorage.clear();
    });

    it('should initialize with default keybinds when localStorage is empty', () => {
      service = TestBed.inject(KeybindService);
      expect(service.keybinds()).toEqual([
        { command: 'Open Help Dialog', character: 'e' },
        { command: 'Open Stats', character: 'r' },
      ]);
    });

    it('should load migrated keybinds from localStorage on initialization', () => {
      const savedData = JSON.stringify([{ command: 'Open Stats', character: 'z' }]);
      localStorage.setItem(STORAGE_KEY, savedData);

      service = TestBed.inject(KeybindService);

      const statsKb = service.keybinds().find(k => k.command === 'Open Stats');
      expect(statsKb?.character).toBe('z');
    });

    it('should update a specific keybind and normalize the input', () => {
      service = TestBed.inject(KeybindService);
      service.updateKeybind('Open Help Dialog', 'Alt + K');

      const kb = service.keybinds().find(k => k.command === 'Open Help Dialog');
      expect(kb?.character).toBe('k'); // normalized to last char
    });

    it('should return true and prevent default when matchShortcut matches', () => {
      service = TestBed.inject(KeybindService);
      const event = new KeyboardEvent('keydown', { key: 'e', altKey: true });

      spyOn(event, 'preventDefault');
      spyOn(event, 'stopImmediatePropagation');

      const isMatch = service.matchShortcut(event, 'Open Help Dialog');

      expect(isMatch).toBeTrue();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopImmediatePropagation).toHaveBeenCalled();
    });

    it('should return false when matchShortcut does not match key', () => {
      service = TestBed.inject(KeybindService);
      const event = new KeyboardEvent('keydown', { key: 'x', altKey: true });

      const isMatch = service.matchShortcut(event, 'Open Help Dialog');
      expect(isMatch).toBeFalse();
    });

    it('should reset to defaults and clear localStorage', () => {
      service = TestBed.inject(KeybindService);
      service.updateKeybind('Open Stats', 'x');

      service.resetToDefaults();

      expect(service.keybinds()[1].character).toBe('r'); // Default value
      expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });
  });

  describe('Server Environment (SSR)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          KeybindService,
          { provide: PLATFORM_ID, useValue: 'server' } // Simulate Server
        ]
      });
    });

    it('should not attempt to access localStorage on the server', () => {
      expect(() => TestBed.inject(KeybindService)).not.toThrow();
    });
  });
});
