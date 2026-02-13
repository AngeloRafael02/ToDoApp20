import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Clock } from './clock';
import { PLATFORM_ID } from '@angular/core';

describe('Clock', () => {
  let component: Clock;
  let fixture: ComponentFixture<Clock>;

  async function setupTestBed(platform: string) {
    await TestBed.configureTestingModule({
      // Clock is standalone, so it goes in imports
      imports: [Clock],
      providers: [
        provideZonelessChangeDetection(),
        { provide: PLATFORM_ID, useValue: platform }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Clock);
    component = fixture.componentInstance;
  }

  describe('Browser Environment', () => {
    beforeEach(async () => {
      jasmine.clock().uninstall();

      await setupTestBed('browser');

      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should update currentTime signal every second', () => {
      const baseTime = new Date();
      jasmine.clock().mockDate(baseTime);

      fixture.detectChanges();
      const initialTime = component.currentTime().getTime();

      jasmine.clock().tick(1000);

      const updatedTime = component.currentTime().getTime();
      expect(updatedTime).toBe(initialTime + 1000);
    });
  });

  describe('Server Environment', () => {
    beforeEach(async () => {
      await setupTestBed('server');
    });

    it('should NOT start interval on server', () => {
      const setIntervalSpy = spyOn(window, 'setInterval');
      fixture.detectChanges();
      expect(setIntervalSpy).not.toHaveBeenCalled();
    });
  });
});
