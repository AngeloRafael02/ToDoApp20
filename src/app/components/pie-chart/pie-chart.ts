
import { Component, Input, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID, OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { chartDataInterface } from '../../interfaces/misc.interface';

@Component({
  selector: 'pie-chart',
  standalone: true,
  template: `
    <div style="width: 300px; height: 300px;">
      <canvas #pieCanvas></canvas>
    </div>
  `
})
export class PieChart implements AfterViewInit, OnChanges {
  @ViewChild('pieCanvas') private pieCanvas!: ElementRef;
  @Input() data: chartDataInterface[] = [];
  
  public chart?: Chart<'pie', number[], string>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    Chart.register(...registerables);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.chart) {
      this.chart.destroy();
      this.createChart();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.createChart();
    }
  }

  public createChart():void {
    const labels = this.data.map(item => item.name);
    const values = this.data.map(item => item.value);

    this.chart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: this.generateHexArray(this.data.length),
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#ffffff',
              font: {
                size: 14
              }
            }
          }
        }
      }
    });
  }

  public generateHexArray(count:number):string[] {
    const hexChars = '0123456789ABCDEF';
    const result = [];
    for (let i = 0; i < count; i++) {
      let color = '#';
      for (let j = 0; j < 6; j++) {
        color += hexChars[Math.floor(Math.random() * 16)];
      }
      result.push(color);
    }
    return result;
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