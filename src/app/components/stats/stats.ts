import { Component,OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { forkJoin } from 'rxjs';

import { PieChart } from '../pie-chart/pie-chart';
import { BackendService } from '../../services/backend/backend';
import { chartDataInterface } from '../../interfaces/misc.interface';

@Component({
  selector: 'stats',
  imports: [
    CommonModule,
    MatExpansionModule,
    PieChart
  ],
  template: `
    <div class="stats-wrapper">
      <mat-expansion-panel  (opened)="panelOpenState.set(true)" (closed)="panelOpenState.set(false)">
        <mat-expansion-panel-header>
          <mat-panel-title>
            <p>Tasks Statistics</p>
          </mat-panel-title>
          <mat-panel-description>
            <p>{{panelOpenState() ? 'Show' : 'Hide'}} Stats</p>
          </mat-panel-description>
        </mat-expansion-panel-header>
        <div class="stats-div">
          <pie-chart [data]="(catData)" chartTitle="Grouped by Categories"></pie-chart>
          <pie-chart [data]="(statsData)" chartTitle="Grouped by Status"></pie-chart>
          <pie-chart [data]="(threatsData)" chartTitle="Grouped by Threat Levels"></pie-chart>
        </div>
      </mat-expansion-panel>
    </div>

  `,
  styles: `
    @use '../../styles/pallete.scss' as pallete;

    .stats-wrapper {
      box-shadow: 0px 0px 49px 6px rgba(0,0,0,0.75);
      -webkit-box-shadow: 0px 0px 49px 6px rgba(0,0,0,0.75);
      -moz-box-shadow: 0px 0px 49px 6px rgba(0,0,0,0.75);
      mat-expansion-panel, mat-expansion-panel-header {
        background-color: pallete.$color1;
        p {
          color: pallete.$primaryTextColor;
        }
      }
      .stats-div{
        display: flex;
        justify-content: space-between;
        padding-top:1%;
        padding-bottom:1%;
      }
    }
  `
})
export class Stats implements OnInit {

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
}
