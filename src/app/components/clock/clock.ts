import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, signal } from '@angular/core';

@Component({
  selector: 'app-clock',
  imports: [DatePipe],
  template: `
<div class="digital-clock">
      <div class="date-row">{{ currentTime() | date:'EEEE, MMM d, y' }}</div>
      <div class="time-row">{{ currentTime() | date:'HH:mm:ss z' }}</div>
    </div>
  `,
  styles: `
    @use '../../styles/pallete.scss' as palette;
    .digital-clock {
      margin: 1rem;
      font-weight: 500;
      background-color: transparent;
      color: palette.$primaryTextColor;
      display: flex;
      gap: 10px;
      flex-direction: column;
      align-items: center;
      text-align: center;
      .date-row {
        font-size: 1.3rem;
        opacity: 0.8;
      }
      .time-row {
        font-size: 1.8rem;
        white-space: nowrap;
        margin-top: 0.2rem;
      }
    }
  `
})
export class Clock implements OnInit, OnDestroy  {
  public currentTime = signal(new Date());
  private timerId: any;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.timerId = setInterval(() => {
        this.currentTime.set(new Date());
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }
}
