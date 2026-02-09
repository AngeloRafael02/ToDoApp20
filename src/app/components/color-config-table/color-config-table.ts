import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms'; // Added for ngModel

@Component({
  selector: 'color-config-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule
  ],
  template: `
    <div class="table-card">
      <h3>{{ title }}</h3>
      <table mat-table [dataSource]="data || []" class="mat-elevation-z2">

        <ng-container matColumnDef="displayValue">
          <th mat-header-cell *matHeaderCellDef> <strong>Value</strong> </th>
          <td mat-cell *matCellDef="let element">
            {{ element[displayKey] }}
          </td>
        </ng-container>

        <ng-container matColumnDef="color">
          <th mat-header-cell *matHeaderCellDef> <strong>Color</strong> </th>
          <td mat-cell *matCellDef="let element">
            <div class="color-cell">
              <input
                type="color"
                class="color-picker-input"
                [ngModel]="formatHex(element.color)"
                (ngModelChange)="onColorUpdate(element, $event)"
              />
              <code>#{{ element.color | lowercase }}</code>
            </div>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .table-card {
      flex: 1;
      width: 300px;
      h3 {
        margin-bottom: 12px;
        color: var(--app-primary-text);
        font-size: 1.1rem;
      }
      table {
        width: 95%;
        border-radius: 4px;
        overflow: hidden;
      }
      .color-cell {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .color-picker-input {
        appearance: none;
        -webkit-appearance: none;
        border: 1px solid rgba(0,0,0,0.1);
        width: 24px;
        height: 24px;
        cursor: pointer;
        background: none;
        padding: 0;
        border-radius: 4px;

        &::-webkit-color-swatch-wrapper { padding: 0; }
        &::-webkit-color-swatch {
          border: none;
          border-radius: 3px;
        }
      }
      code {
        font-size: 0.85rem;
        color: #666;
      }
    }
    @media (min-width: 1024px) {
      .table-card {
        flex: 1;
        width:500px;
      }
    }
  `],
})
export class ColorConfigTable {
  @Input() data: any[] | null = [];
  @Input() title: string = '';
  @Input() displayKey: string = '';

  @Output() colorChange = new EventEmitter<{ row: any, newColor: string }>();

  displayedColumns: string[] = ['displayValue', 'color'];

  public formatHex(color: string): string {
    if (!color) return '#000000';
    return color.startsWith('#') ? color : `#${color}`;
  }

  public onColorUpdate(element: any, newHexWithHash: string): void {
    const cleanHex = newHexWithHash.replace('#', '');
    element.color = cleanHex;
    this.colorChange.emit({ row: element, newColor: cleanHex });
  }
}
