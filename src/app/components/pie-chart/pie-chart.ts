
import { Component, Input, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { chartDataInterface } from '../../interfaces/misc.interface';

@Component({
  selector: 'pie-chart',
  standalone: true,
  template: `
    <div style="width: 400px; height: 400px;">
      <canvas #pieCanvas></canvas>
    </div>
  `
})
export class PieChart implements AfterViewInit {
  @ViewChild('pieCanvas') private pieCanvas!: ElementRef;
  @Input() data: chartDataInterface[] = [];
  
  chart: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.createChart();
    }
  }

  createChart() {
    const labels = this.data.map(item => item.name);
    const values = this.data.map(item => item.value);

    this.chart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    });
  }
}

/* To use this Component, import Component and interface then do the code below
 * template:
 * <pie-chart [data]="salesData" title="Sales Distribution"></pie-chart>
 * 
 * data structure example:
 * public salesData: chartDataInterface[] = [
    { name: 'Electronics', value: 450 },
    { name: 'Groceries', value: 200 },
    { name: 'Apparel', value: 150 },
    { name: 'Home Decor', value: 100 }
  ];
 */