import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { delay, Observable } from 'rxjs';

import { categoriesInterface, conditionInterface, ConfigType, threatInterface } from '../../interfaces/forms.interface';
import { DropdownDataService } from '../../services/dropdown-data/dropdown-data';
import { ColorConfigTable } from '../color-config-table/color-config-table';
@Component({
  selector: 'color-config',
  imports: [
    CommonModule, 
    MatTableModule,
    MatButtonModule,
    ColorConfigTable
],
  template: `
    <div class="dashboard-container">
      <button mat-flat-button (click)="dataService.callAPIforData()">Reset to Default</button>
      <div class="tables-flex-wrapper">
        
        <color-config-table 
          title="Categories" 
          [data]="categories$ | async" 
          displayKey="cat"
          (colorChange)="onColorUpdate('categories', $event.row)">
        </color-config-table>

        <color-config-table 
          title="Conditions" 
          [data]="statuses$ | async" 
          displayKey="stat"
          (colorChange)="onColorUpdate('statuses', $event.row)">
        </color-config-table>

        <color-config-table 
          title="Threat Levels" 
          [data]="threatLevels$ | async" 
          displayKey="level"
          (colorChange)="onColorUpdate('threatLevels', $event.row)">
        </color-config-table>

      </div>
    </div>
  `,
  styles: [`    
    .dashboard-container { 
      padding: 1rem; 
      .tables-flex-wrapper {
        display: flex;
        justify-content:space-between;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 2rem;
      }
    }

  `]
})
export class ColorConfig implements OnInit,AfterViewInit {
  public categoryColumns: string[] = ['cat', 'color'];
  public statusColumns: string[] = ['stat', 'color'];
  public threatColumns: string[] = ['level', 'color'];

  public categories$: Observable<categoriesInterface[] | null>;
  public statuses$: Observable<conditionInterface[] | null>;
  threatLevels$: Observable<threatInterface[] | null>;

  constructor(
    private cd: ChangeDetectorRef,
    public  dataService: DropdownDataService,
  ) {}

  ngOnInit(): void {
    this.categories$ = this.dataService.categories$.pipe(delay(0));
    this.statuses$ = this.dataService.statuses$.pipe(delay(0));
    this.threatLevels$ = this.dataService.threatLevels$.pipe(delay(0));
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges()
  }

  onColorUpdate(type: ConfigType, row: any): void {
    this.dataService.updateColor(type, row);
  }
}
