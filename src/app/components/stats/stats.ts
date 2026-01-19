import { ChangeDetectorRef, Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { forkJoin } from 'rxjs';

import { PieChart } from '../pie-chart/pie-chart';
import { ColorConfig } from '../color-config/color-config';
import { BackendService } from '../../services/backend/backend';
import { chartDataInterface } from '../../interfaces/misc.interface';

@Component({
  selector: 'stats',
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    PieChart,
    ColorConfig
  ],
  template: `
    <div class="stats-wrapper">
      <mat-expansion-panel (opened)="panelOpenState.set(true)" (closed)="panelOpenState.set(false)">
        <mat-expansion-panel-header>
          <mat-panel-title><p>Tasks Statistics</p></mat-panel-title>
          <mat-panel-description>
            <p>{{panelOpenState() ? 'Show' : 'Hide'}} Stats</p>
          </mat-panel-description>
        </mat-expansion-panel-header>

        <div class="carousel-container">
          <mat-tab-group mat-stretch-tabs="false" mat-align-tabs="start" class="custom-tab-group">
            <mat-tab label="Charts">
              <button mat-icon-button class="nav-btn left" (click)="scroll('left')">
                <mat-icon>chevron_left</mat-icon>
              </button>

              <div class="stats-div" #scrollContainer>
                <div class="chart-item"><pie-chart [data]="catData" chartTitle="Categories"></pie-chart></div>
                <div class="chart-item"><pie-chart [data]="statsData" chartTitle="Status"></pie-chart></div>
                <div class="chart-item"><pie-chart [data]="threatsData" chartTitle="Threat Levels"></pie-chart></div>
              </div>

              <button mat-icon-button class="nav-btn right" (click)="scroll('right')">
                <mat-icon>chevron_right</mat-icon>
              </button>
            </mat-tab>
            <mat-tab label="Config">
              <color-config></color-config>
            </mat-tab>
          </mat-tab-group>
        </div>
      </mat-expansion-panel>
    </div>
  `,
  styles: `
    @use '../../styles/pallete.scss' as pallete;

    .stats-wrapper {
      border-radius: 25px;
      box-shadow: 0px 0px 49px 6px rgba(0,0,0,0.75);
      -webkit-box-shadow: 0px 0px 49px 6px rgba(0,0,0,0.75);
      -moz-box-shadow: 0px 0px 49px 6px rgba(0,0,0,0.75);
      mat-expansion-panel, mat-expansion-panel-header {
        background-color: pallete.$color1;

        p {
          color: pallete.$primaryTextColor;
        }

::ng-deep .mat-mdc-tab-body-content {
  max-height: 350px;
  overflow-y: auto;
}

        .carousel-container {
          position: relative;
          display: block;
          width: 100%;

          .custom-tab-group {
            ::ng-deep {
              .mdc-tab:hover .mdc-tab__ripple {
                background-color: pallete.$color3;
              }
              .mdc-tab--active {
                background-color: pallete.$color3;
                border-radius: 4px 4px 0 0;
                .mdc-tab__text-label {
                  color: pallete.$primaryTextColor;
                }
              }
              .mdc-tab__text-label {
                color: pallete.$primaryTextColor;
              }
              .mdc-tab--active .mdc-tab__text-label {
                color: pallete.$primaryTextColor;
              }
              .mat-mdc-tab-indicator .mdc-tab-indicator__content--underline {
                border-color: pallete.$primaryTextColor;
              }
            }
          }

          .stats-div {
            width: 95%;
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            gap: 20px;
            padding: 10px;

            .chart-item {
              scroll-snap-align: center;
              width: 100%;
              display: flex;
              justify-content: center;
            }

            &::-webkit-scrollbar { display: none; }
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

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
          }
        }
      }
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

  private id:number = 1; //temporary

  public catData:chartDataInterface[] = [];
  public statsData:chartDataInterface[] = [];
  public threatsData:chartDataInterface[] = [];

  public readonly panelOpenState = signal(false);

  constructor(
    private cdr: ChangeDetectorRef,
    private backendService:BackendService
  ){}

  ngOnInit(): void {
    forkJoin({
      categories: this.backendService.getChartData<chartDataInterface[]>(this.id,'categories'),
      status: this.backendService.getChartData<chartDataInterface[]>(this.id,'status'),
      threats: this.backendService.getChartData<chartDataInterface[]>(this.id,'threats'),
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

  public scroll(direction: 'left' | 'right') {
    const distance = 320;
    this.scrollContainer.nativeElement.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth'
    });
  }
}
