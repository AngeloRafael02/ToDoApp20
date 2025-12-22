import { Component,OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';

import { PieChart } from '../pie-chart/pie-chart';
import { BackendService } from '../../services/backend/backend';
import { chartDataInterface, chartDataOrMessage } from '../../interfaces/misc.interface';
import { messageInterface } from '../../interfaces/message.interface';

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

    mat-expansion-panel {
      --mat-expansion-container-background-color: pallete.$color2;
    }

    mat-expansion-panel.mat-expanded {
      --mat-expansion-container-background-color: pallete.$color2;
      --mat-expansion-header-hover-state-layer-color: rgba(0,0,0,0.04);
    }

    p {
      color:white;
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
    this.backendService.getChartData(this.id,'categories').subscribe(data => {
      if (!this.isErrorMessage(data)){
        this.catData = data;
        console.log(data)
      } else {
        alert(data.message);
      }
    });
    this.backendService.getChartData(this.id,'status').subscribe(data => {
      if (!this.isErrorMessage(data)){
        this.statsData = data;
        console.log(data)
      } else {
        alert(data.message);
      }
    });
    this.backendService.getChartData(this.id,'threat level').subscribe(data => {
      if (!this.isErrorMessage(data)){
        this.threatsData = data;
        console.log(data)
      } else {
        alert(data.message);
      }
    });
  }

  private isErrorMessage(obj:chartDataOrMessage):obj is messageInterface {
    return 'message' in obj && typeof (obj as messageInterface).message === 'string';
  }
}
