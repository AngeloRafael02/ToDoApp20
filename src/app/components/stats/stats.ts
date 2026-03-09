import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { forkJoin } from 'rxjs';

import { PieChart } from '../pie-chart/pie-chart';
import { ColorConfig } from '../color-config/color-config';
import { BackendService } from '../../services/backend/backend';
import { chartDataInterface, PieSliceInterface } from '../../interfaces/misc.interface';
import { Router } from '@angular/router';
import { TableFilterService } from '../../services/table-filter/table-filter';
import { KeybindService } from '../../services/keybinds/keybinds';

@Component({
  selector: 'stats',
  imports: [
    CommonModule,
    MatExpansionModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    PieChart,
    ColorConfig
  ],
  template: `
    <div class="stats-wrapper">
      <mat-expansion-panel [expanded]="panelOpenState()" (opened)="panelOpenState.set(true)" (closed)="panelOpenState.set(false)">
        <mat-expansion-panel-header>
          <mat-panel-title><p>Tasks Statistics</p></mat-panel-title>
          <mat-panel-description>
            <p>{{panelOpenState() ? 'Show' : 'Hide'}} Stats</p>
          </mat-panel-description>
        </mat-expansion-panel-header>

        <div class="carousel-container">
          <mat-tab-group cdkDropList cdkDropListOrientation="horizontal" (cdkDropListDropped)="drop($event)" mat-stretch-tabs="false" mat-align-tabs="start" class="custom-tab-group">
            @for (tab of tabs; track tab) {
              <mat-tab>
                <ng-template mat-tab-label>
                  <span cdkDrag cdkDragPreviewClass="example-drag-tabs-preview" cdkDragRootElement=".mat-mdc-tab">
                    {{tab}}
                  </span>
                </ng-template>

                @if (tab === 'Charts') {
                  <button mat-icon-button class="nav-btn left" (click)="scroll('left')">
                    <mat-icon>chevron_left</mat-icon>
                  </button>

                  <div class="stats-div" #scrollContainer>
                    <div class="chart-item"><pie-chart [data]="catData" chartTitle="Categories" (sliceClick)="handleSliceClick($event)"></pie-chart></div>
                    <div class="chart-item"><pie-chart [data]="statsData" chartTitle="Status" (sliceClick)="handleSliceClick($event)"></pie-chart></div>
                    <div class="chart-item"><pie-chart [data]="threatsData" chartTitle="Threat Levels" (sliceClick)="handleSliceClick($event)"></pie-chart></div>
                  </div>

                  <button mat-icon-button class="nav-btn right" (click)="scroll('right')">
                    <mat-icon>chevron_right</mat-icon>
                  </button>
                } @else if (tab === 'Config') {
                  <color-config></color-config>
                }
              </mat-tab>
            }
          </mat-tab-group>
        </div>
      </mat-expansion-panel>
    </div>
  `,
  styles: `
    .stats-wrapper {
      border-radius: 25px;
      box-shadow: 0px 0px 49px 6px rgba(0, 0, 0, 0.75);

      mat-expansion-panel,
      mat-expansion-panel-header {
        background-color: var(--app-color1);
        p {
          color: var(--app-primary-text);
        }
      }

      ::ng-deep {
        .mat-mdc-tab-body-content {
          max-height: 350px;
          overflow-y: auto;
        }

        .custom-tab-group {
          .mdc-tab:hover .mdc-tab__ripple {
            background-color: var(--app-color3);
          }

          .mdc-tab--active {
            background-color: var(--app-color3);
            border-radius: 4px 4px 0 0;
          }

          .mdc-tab__text-label,
          .mdc-tab--active .mdc-tab__text-label {
            color: var(--app-primary-text);
          }

          .mat-mdc-tab-indicator .mdc-tab-indicator__content--underline {
            border-color: var(--app-primary-text);
          }
        }
      }
    }

    .carousel-container {
      position: relative;
      display: block;
      width: 100%;

      .nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 20;
        background: rgba(0, 0, 0, 0.3);
        color: white;
        border-radius: 50%;

        &.left { left: 5px; }
        &.right { right: 5px; }
        &:hover {
          background: rgba(0, 0, 0, 0.5);
        }

        @media (min-width: 1024px) {
          display: none;
        }
      }
    }

    .stats-div {
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      overflow: hidden;
      gap: 10px;
      padding: 10px 0;
      justify-content: space-around;

      .chart-item {
        scroll-snap-align: center;
        width: 100%;
        display: flex;
        justify-content: center;

        @media (min-width: 1024px) {
          width: 30%;
        }
      }
    }

    .example-drag-tabs-preview.cdk-drag-animating {
      transition: all 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .mat-mdc-tab.example-drag-tabs-preview {
      outline: dashed 1px #ccc;
      outline-offset: 4px;
    }

    @media (min-width: 1024px) {
      .nav-btn { display: none; }
      .stats-div {
        justify-content: space-between;
        overflow: hidden;
      }
      .chart-item {
        width: 30%;
      }
    }
  `
})
export class Stats implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  private id: number = 1; //temporary

  public catData: chartDataInterface[] = [];
  public statsData: chartDataInterface[] = [];
  public threatsData: chartDataInterface[] = [];
  public tabs = ['Charts', 'Config'];

  public readonly panelOpenState = signal(false);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private backendService: BackendService,
    private filterService: TableFilterService,
    private keybindService: KeybindService
  ) { }


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      forkJoin({
        categories: this.backendService.getChartData<chartDataInterface[]>(this.id, 'categories'),
        status: this.backendService.getChartData<chartDataInterface[]>(this.id, 'status'),
        threats: this.backendService.getChartData<chartDataInterface[]>(this.id, 'threats'),
      }).subscribe({
        next: (result) => {
          this.catData = result.categories.data;
          this.statsData = result.status.data;
          this.threatsData = result.threats.data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to load chart data', err)
      })
    }
  }

  public scroll(direction: 'left' | 'right') {
    const distance = 320;
    this.scrollContainer.nativeElement.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth'
    });
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tabs, event.previousIndex, event.currentIndex);
  }

  @HostListener('window:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent) {
    if (this.keybindService.matchShortcut(event, 'Open Stats')) {
      event.preventDefault();
      this.panelOpenState.update((value:boolean) => !value);
    }
  }

  private currentFilter: string = '';
  public handleSliceClick(event: PieSliceInterface) {
    switch (event.chartTitle) {
      case 'Status':
        this.router.navigateByUrl(`/Status/${event.name}`).then(() => {
          this.filterService.setFilter('');
          this.currentFilter = '';
        });
        break;
      case 'Categories':
      case 'Threat Levels':
        const nextFilter = this.currentFilter === event.name ? '' : event.name;
        this.router.navigateByUrl(`/Status/All`).then(() => {
          this.filterService.setFilter(nextFilter);
          this.currentFilter = nextFilter;
        });
        break;
    }
  }
}
