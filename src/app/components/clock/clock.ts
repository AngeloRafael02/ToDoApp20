import { DatePipe, isPlatformBrowser, CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, signal, HostListener } from '@angular/core';

@Component({
  selector: 'app-clock',
  imports: [
    CommonModule,
    DatePipe
  ],
  template: `
    <div class="digital-clock" role="timer" [attr.aria-label]="'Current time is ' + (currentTime() | date:'shortTime')" tabindex="0">
      <time [attr.datetime]="currentTime().toISOString()">
        <div class="date-row" aria-hidden="true">
          {{ currentTime() | date:'EEEE, MMM d, y' }}
        </div>
        <div class="time-row">
          {{ currentTime() | date:'HH:mm:ss z' }}
        </div>
      </time>

      <span class="sr-only">Press Alt + Shift + T to hear the current time.</span>
    </div>

    <div class="sr-only" aria-live="assertive" aria-atomic="true">
      {{ announcement() }}
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
      outline: none;

      &:focus {
        border-radius: 8px;
        box-shadow: 0 0 0 2px palette.$primaryTextColor;
      }

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

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  `
})
export class Clock implements OnInit, OnDestroy {
  public currentTime = signal(new Date());
  public announcement = signal('');
  private timerId: any;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // Keybind: Alt + Shift + T
  @HostListener('window:keydown.alt.shift.t', ['$event'])
  public handleKeybind(event: Event): void {
    event.preventDefault();
    const timeString = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
    }).format(this.currentTime());
    this.announcement.set(`The current time is ${timeString}`);
    setTimeout(() => this.announcement.set(''), 1000);
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
