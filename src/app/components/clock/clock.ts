import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, signal } from '@angular/core';

@Component({
  selector: 'app-clock',
  imports: [DatePipe],
  template: `
    <div class="digital-clock">
      <h2>{{ currentTime() | date:'EEEE MMM d y HH:mm:ss z' }}</h2>
    </div>
  `,
  styles: `
    .digital-clock {
      text-align: center;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 1.5em;
      font-weight: 500;
      padding: 20px;
      border: 1px solid #007bff;
      background-color: #f8f9fa;
      border-radius: 8px;
      display: inline-block;
      color: #333;
    }
    h2 {
        margin: 0;
        white-space: nowrap;
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