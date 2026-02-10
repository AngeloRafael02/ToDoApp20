import { Injectable, Inject, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  private isBrowser: boolean;
  private darkMode = false;

  /** Emits when the theme is toggled so components (e.g. charts) can update their colors. */
  readonly themeChanged$ = new Subject<void>();

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('theme');
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.darkMode = savedTheme === 'dark' || (!savedTheme && systemDark);
      this.updateTheme();
    }
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    if (this.isBrowser) {
      localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    }
    this.updateTheme();
    this.themeChanged$.next();
  }

  private updateTheme() {
    if (!this.isBrowser) return;

    if (this.darkMode) {
      this.renderer.addClass(document.documentElement, 'dark-mode');
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark-mode');
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }

  isDark() { return this.darkMode; }
}
