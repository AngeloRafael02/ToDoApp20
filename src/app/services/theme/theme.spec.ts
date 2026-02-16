import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID, Renderer2, RendererFactory2, provideZonelessChangeDetection } from '@angular/core';
import { ThemeService } from './theme';

describe('ThemeService', () => {
  let service: ThemeService;
  let renderer: jasmine.SpyObj<Renderer2>;

  beforeEach(() => {
    const rendererSpy = jasmine.createSpyObj('Renderer2', ['addClass', 'removeClass']);
    const rendererFactorySpy = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
    rendererFactorySpy.createRenderer.and.returnValue(rendererSpy);

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        provideZonelessChangeDetection(),
        { provide: RendererFactory2, useValue: rendererFactorySpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(ThemeService);
    renderer = rendererSpy;

    localStorage.clear();
  });

  it('should have a default theme state based on environment', () => {
    expect(service.isDark()).toBeTrue();
  });

  it('should toggle the theme and update the state', () => {
    service.toggleTheme();
    expect(service.isDark()).toBeFalse();

    service.toggleTheme();
    expect(service.isDark()).toBeTrue();
  });

  it('should call Renderer2 to add/remove classes on toggle', () => {
    service.toggleTheme();
    expect(renderer.addClass).toHaveBeenCalledWith(jasmine.any(Object), 'dark-mode');

    service.toggleTheme();
    expect(renderer.removeClass).toHaveBeenCalledWith(jasmine.any(Object), 'dark-mode');
  });

  it('should emit themeChanged$ when toggled', (done) => {
    service.themeChanged$.subscribe(() => {
      expect(true).toBeTrue();
      done();
    });
    service.toggleTheme();
  });

  it('should persist the theme choice to localStorage', () => {
    service.toggleTheme();
    expect(localStorage.getItem('theme')).toBe('light');

    service.toggleTheme();
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
