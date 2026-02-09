import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme/theme';

@Component({
  selector: 'theme-toggle',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, MatIconModule, FormsModule],
  template: `
    <div class="toggle-container">
      <mat-icon>{{ themeService.isDark() ? 'dark_mode' : 'light_mode' }}</mat-icon>
      <mat-slide-toggle
        [ngModel]="themeService.isDark()"
        (change)="themeService.toggleTheme()"
        color="primary">
      </mat-slide-toggle>
    </div>
  `,
  styles: [`
    .toggle-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) {}
}
