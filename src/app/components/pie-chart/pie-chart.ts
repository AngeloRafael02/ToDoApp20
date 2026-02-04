import { Component, Input, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID, OnChanges, SimpleChanges, OnDestroy, EventEmitter, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Subscription, combineLatest } from 'rxjs';

import { chartDataInterface, PieSliceInterface } from '../../interfaces/misc.interface';
import { DropdownDataService } from '../../services/dropdown-data/dropdown-data';

@Component({
  selector: 'pie-chart',
  standalone: true,
  template: `
    <div style="width: 300px; height: 300px;">
      <canvas #pieCanvas></canvas>
    </div>
  `
})
export class PieChart implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('pieCanvas') private pieCanvas!: ElementRef;
  @Input() data: chartDataInterface[] = [];
  @Input() chartTitle: string = '';
  @Output() sliceClick = new EventEmitter<PieSliceInterface>();

  public chart?: Chart<'pie', number[], string>;
  private subscription: Subscription = new Subscription();
  private colorMap: Record<string, string> = {};

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private dropdownService: DropdownDataService
  ) {
    Chart.register(...registerables);
    this.initializeColorMap();
  }

  private initializeColorMap(): void {
    const sub = combineLatest([
      this.dropdownService.categories$,
      this.dropdownService.statuses$,
      this.dropdownService.threatLevels$
    ]).subscribe(([cats, stats, threats]) => {
      this.colorMap = {};
      cats?.forEach(c => this.colorMap[c.cat] = `#${c.color}`);
      stats?.forEach(s => this.colorMap[s.stat] = `#${s.color}`);
      threats?.forEach(t => this.colorMap[t.level] = `#${t.color}`);
      if (this.chart) this.updateChartColors();
    });
    this.subscription.add(sub);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['data'] || changes['chartTitle']) && this.chart) {
      this.chart.destroy();
      this.createChart();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.createChart();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private updateChartColors(): void {
    if (this.chart) {
      this.chart.data.datasets[0].backgroundColor = this.getPieSliceColors();
      this.chart.update();
    }
  }

  public createChart(): void {
    const labels = this.data.map(item => item.name);
    const values = this.data.map(item => item.value);

    this.chart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: this.getPieSliceColors()
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const sliceName = labels[index];
            const sliceValue = values[index];
            this.sliceClick.emit({
              name: sliceName,
              value: sliceValue,
              chartTitle: this.chartTitle
            });
          }
        },
        plugins: {
          title: {
            display: !!this.chartTitle,
            text: this.chartTitle,
            color: '#ffffff',
            font: { size: 18, weight: 'bold' },
            padding: { top: 10, bottom: 20 }
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: { color: '#ffffff', font: { size: 14 } }
          }
        }
      }
    });
  }

  private getPieSliceColors(): string[] {
    return this.data.map(item => {
      return this.colorMap[item.name] || this.generateRandomHex();
    });
  }

  private generateRandomHex(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }
}
