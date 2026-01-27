import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Added for nav buttons
import { MatTooltipModule } from '@angular/material/tooltip';
import { delay, Observable } from 'rxjs';

import { categoriesInterface, conditionInterface, ConfigType, threatInterface } from '../../interfaces/forms.interface';
import { DropdownDataService } from '../../services/dropdown-data/dropdown-data';
import { ColorConfigTable } from '../color-config-table/color-config-table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { snackbarConfig } from '../../config/snackbar.config';

@Component({
  selector: 'color-config',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    ColorConfigTable
  ],
  template: `
    <div class="dashboard-container">
      <div class="header-actions">
        <button mat-flat-button color="warn" matTooltip="Queries data online" matTooltipPosition="right"  (click)="resetToDeafult()">Reset to Default</button>
      </div>

      <div class="carousel-wrapper">
        <div class="tables-scroll-container" #scrollContainer>
          <div class="table-item">
            <color-config-table
              title="Categories"
              [data]="categories$ | async"
              displayKey="cat"
              (colorChange)="onColorUpdate('categories', $event.row)">
            </color-config-table>
          </div>

          <div class="table-item">
            <color-config-table
              title="Conditions"
              [data]="statuses$ | async"
              displayKey="stat"
              (colorChange)="onColorUpdate('statuses', $event.row)">
            </color-config-table>
          </div>

          <div class="table-item">
            <color-config-table
              title="Threat Levels"
              [data]="threatLevels$ | async"
              displayKey="level"
              (colorChange)="onColorUpdate('threatLevels', $event.row)">
            </color-config-table>
          </div>
        </div>


      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding-top: 1rem;

      .header-actions {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .reset-note {
          color: white;
          font-size: 10px;
          opacity: 0.8;
          margin-left:1rem;
        }
      }

      .carousel-wrapper {
        position: relative;
        width: 100%;
        .tables-scroll-container {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;

          &::-webkit-scrollbar { display: none; }
          scrollbar-width: none;
          -ms-overflow-style: none;

          .table-item {
            min-width: 100%;
            scroll-snap-align: start;
            flex-shrink: 0;
          }
        }
      }
    }

    @media (min-width: 1024px) {
      .dashboard-container .carousel-wrapper {
        .nav-btn { display: none; }

        .tables-scroll-container {
          overflow: hidden;
          justify-content: space-between;

          .table-item {
            min-width: calc(33% - 1rem);
          }
        }
      }
    }
  `]
})
export class ColorConfig implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  public categories$: Observable<categoriesInterface[] | null>;
  public statuses$: Observable<conditionInterface[] | null>;
  public threatLevels$: Observable<threatInterface[] | null>;

  constructor(
    private cd: ChangeDetectorRef,
    public dataService: DropdownDataService,
    private snackBar:MatSnackBar
  ) {}

  ngOnInit(): void {
    this.categories$ = this.dataService.categories$.pipe(delay(0));
    this.statuses$ = this.dataService.statuses$.pipe(delay(0));
    this.threatLevels$ = this.dataService.threatLevels$.pipe(delay(0));
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  onColorUpdate(type: ConfigType, row: any): void {
    this.dataService.updateColor(type, row);
  }

  public resetToDeafult(){
    this.dataService.callAPIforData()
    this.snackBar.open('Data reset to default!', 'Dismiss', snackbarConfig);
  }
}
