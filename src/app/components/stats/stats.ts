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
        <pie-chart [data]="(catData)" title="Tasks Grouped by Categories"></pie-chart>
        <pie-chart [data]="(statsData)" title="Tasks Grouped by Status"></pie-chart>
        <pie-chart [data]="(threatsData)" title="Tasks Grouped by Threat levels"></pie-chart>
      </div>
    </mat-expansion-panel>
  `,
  styles: `
    @use '../../styles/pallete.scss' as pallete;

    mat-expansion-panel, mat-expansion-panel-header {
      background-color: pallete.$color1;
    }

    p {
      color: pallete.$primaryTextColor;
    }

    .stats-div{
      display: flex;
      justify-content: space-between;
      padding-top:1%;
      padding-bottom:1%;
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
