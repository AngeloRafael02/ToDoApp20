import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'color-config-table',
  imports: [
    CommonModule,
    MatTableModule
  ],
  template: `
    <div class="table-card">
      <h3>{{ title }}</h3>
      <table mat-table [dataSource]="data || []" class="mat-elevation-z2">
        
        <ng-container matColumnDef="displayValue">
          <th mat-header-cell *matHeaderCellDef> {{ title }} </th>
          <td mat-cell *matCellDef="let element"> 
            {{ element[displayKey] }} 
          </td>
        </ng-container>

        <ng-container matColumnDef="color">
          <th mat-header-cell *matHeaderCellDef> Color </th>
          <td mat-cell *matCellDef="let element"> 
            <div class="color-cell">
              <span [style.background-color]="element.color ? '#' + element.color : 'transparent'"class="color-pill"></span>
              <code>{{ element.color }}</code>
            </div>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    @use '../../styles/pallete.scss' as pallete;

    .table-card { 
      flex: 1; 
      min-width: 500px; 
      h3 { 
        margin-bottom: 12px; 
        color: pallete.$primaryTextColor;
        font-size: 1.1rem; 
      }
      table { 
        width: 100%; 
        border-radius: 4px; 
        overflow: hidden;
        tr {
          border: 1px solid black;
        }
      }
      .color-cell { 
        display: flex; 
        align-items: center; 
      }
      .color-pill {
        display: inline-block;
        width: 16px; height: 16px;
        border-radius: 4px; margin-right: 10px;
        border: 1px solid rgba(0,0,0,0.1);
      }
      code { 
        font-size: 0.85rem; 
        color: #666; 
      }
    }

  `],
})
export class ColorConfigTable {
  @Input() data: unknown[] | null = [];
  @Input() title: string = '';
  @Input() displayKey: string = '';

  displayedColumns: string[] = ['displayValue', 'color'];
}
