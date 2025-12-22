import { Component,OnInit } from '@angular/core';
import { PieChart } from '../pie-chart/pie-chart';
import { BackendService } from '../../services/backend/backend';
import { chartDataInterface, chartDataOrMessage } from '../../interfaces/misc.interface';
import { messageInterface } from '../../interfaces/message.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'stats',
  imports: [
    CommonModule,
    PieChart
  ],
  template: `
    <div class="stats-div">
      <pie-chart [data]="(catData)" title="Tasks Grouped by Categories"></pie-chart>
      <pie-chart [data]="(statsData)" title="Tasks Grouped by Status"></pie-chart>
      <pie-chart [data]="(threatsData)" title="Tasks Grouped by Threat levels"></pie-chart>
    </div>
  `,
  styles: `
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
