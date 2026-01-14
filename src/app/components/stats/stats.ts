import { Component,ElementRef,OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';

import { PieChart } from '../pie-chart/pie-chart';
import { BackendService } from '../../services/backend/backend';
import { chartDataInterface } from '../../interfaces/misc.interface';

@Component({
  selector: 'stats',
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    PieChart
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

        .carousel-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;

          .stats-div {
            width: 100%;
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
            z-index: 10;
            background: transparent;
            color: white;

            &.left { left: 0; }
            &.right { right: 0; }
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
