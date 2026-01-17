import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';

import { categoriesInterface, conditionInterface, threatInterface } from '../../interfaces/forms.interface';
import { DropdownDataService } from '../../services/dropdown-data/dropdown-data';
import { ColorConfigTable } from '../color-config-table/color-config-table';
@Component({
  selector: 'color-config',
  imports: [
    CommonModule, 
    MatTableModule,
    ColorConfigTable
],
  template: `
    <div class="dashboard-container">
      <div class="tables-flex-wrapper">
        
        <color-config-table 
          title="Categories" 
          [data]="categories$ | async" 
          displayKey="cat">
        </color-config-table>

        <color-config-table 
          title="Conditions" 
          [data]="statuses$ | async" 
          displayKey="stat">
        </color-config-table>

        <color-config-table 
          title="Threat Levels" 
          [data]="threatLevels$ | async" 
          displayKey="level">
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
    private dataService: DropdownDataService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.categories$ = this.dataService.categories$;
    this.statuses$ = this.dataService.statuses$;
    this.threatLevels$ = this.dataService.threatLevels$;
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges()
  }
}