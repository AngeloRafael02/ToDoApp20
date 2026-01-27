import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Clock } from './clock';
import { PLATFORM_ID } from '@angular/core';
import { DatePipe } from '@angular/common';

describe('Clock', () => {
  let component: Clock;
  let fixture: ComponentFixture<Clock>;

  async function setupTestBed(platform: string) {
    await TestBed.configureTestingModule({
      imports: [Clock, DatePipe],
      providers: [
        { provide: PLATFORM_ID, useValue: platform }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Clock);
    component = fixture.componentInstance;
  }

  describe('Browser Environment', () => {
    beforeEach(async () => {
      await setupTestBed('browser');
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with current time', () => {
      const now = new Date();
      expect(component.currentTime().getTime()).toBeCloseTo(now.getTime(), -2);
    });

    it('should update currentTime signal every second', fakeAsync(() => {
      fixture.detectChanges();
      const initialTime = component.currentTime().getTime();
      tick(1000);
      const updatedTime = component.currentTime().getTime();
      expect(updatedTime).toBeGreaterThanOrEqual(initialTime + 1000);
      component.ngOnDestroy();
    }));

    it('should clear interval on destroy', fakeAsync(() => {
      fixture.detectChanges();
      const clearIntervalSpy = spyOn(window, 'clearInterval').and.callThrough();
      component.ngOnDestroy();
      expect(clearIntervalSpy).toHaveBeenCalled();
    }));
  });

  describe('Server Environment', () => {
    beforeEach(async () => {
      await setupTestBed('server');
    });

    it('should NOT start interval on server', fakeAsync(() => {
      const setIntervalSpy = spyOn(window, 'setInterval');
      fixture.detectChanges();
      expect(setIntervalSpy).not.toHaveBeenCalled();
    }));
  });
});
