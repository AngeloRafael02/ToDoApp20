import { Injectable, signal, effect, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AppKeybind } from '../../interfaces/misc.interface';

@Injectable({
  providedIn: 'root'
})
export class KeybindService {
  private readonly STORAGE_KEY = 'todo_app_keybinds';

  private readonly DEFAULT_KEYBINDS: AppKeybind[] = [
    { command: 'Open Help Dialog', character: 'e' },
    { command: 'Open Stats', character: 'r' },
  ];

  private _keybinds = signal<AppKeybind[]>(this.DEFAULT_KEYBINDS);
  public readonly keybinds = this._keybinds.asReadonly();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeKeybinds();
  }

  private normalizeCharacter(raw: string): string {
    const trimmed = (raw ?? '').trim().toLowerCase();
    if (!trimmed) return '';

    const lastToken = trimmed.includes('+')
      ? trimmed.split('+').map(t => t.trim()).filter(Boolean).at(-1) ?? ''
      : trimmed;

    return (lastToken[0] ?? '').toLowerCase();
  }

  private initializeKeybinds(): void {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.STORAGE_KEY);

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const migrated: AppKeybind[] = parsed
              .map((kb: any) => {
                const command = typeof kb?.command === 'string' ? kb.command : '';
                if (!command) return null;

                if (typeof kb?.character === 'string') {
                  const character = this.normalizeCharacter(kb.character);
                  return character ? ({ command, character } as AppKeybind) : null;
                }

                if (Array.isArray(kb?.keybind)) {
                  const key = kb.keybind.find((k: unknown) => typeof k === 'string' && k.toLowerCase() !== 'alt') ?? '';
                  const character = this.normalizeCharacter(String(key));
                  return character ? ({ command, character } as AppKeybind) : null;
                }

                return null;
              })
              .filter((kb): kb is AppKeybind => kb !== null);

            if (migrated.length > 0) this._keybinds.set(migrated);
          }
        } catch (e) {
          console.error("Failed to parse keybinds, falling back to defaults", e);
        }
      }

      effect(() => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._keybinds()));
      });
    }
  }

  public updateKeybind(command: string, newKeys: string): void {
    const character = this.normalizeCharacter(newKeys);
    if (!character) return;

    this._keybinds.update(current =>
      current.map(kb => kb.command === command ? { ...kb, character } : kb)
    );
  }

  public matchShortcut(event: KeyboardEvent, command: string): boolean {
    const savedKeybinds = this.keybinds();
    const target = savedKeybinds.find(kb => kb.command === command);

    if (!target) return false;

    const isAltMatch = event.altKey;
    const isKeyMatch = event.key.toLowerCase() === target.character;

    if (isAltMatch && isKeyMatch) {
      event.preventDefault();
      event.stopImmediatePropagation(); // This prevents other Alt-based listeners from firing
      return true;
    }

    return false;
  }

  /** For development or "Reset to Defaults" button */
  public resetToDefaults(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
      this._keybinds.set(this.DEFAULT_KEYBINDS);
    }
  }
}
