import { Component, DOCUMENT, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { Subscription,forkJoin } from 'rxjs';

import { Clock } from './components/clock/clock';
import { TaskTable } from './components/task-table/task-table';
import { Stats } from './components/stats/stats';
import { BackendService } from './services/backend/backend';
import { categoriesInterface, conditionInterface, threatInterface } from './interfaces/forms.interface';
import { DropdownDataService } from './services/dropdown-data/dropdown-data';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatGridListModule,
    Clock,
    TaskTable,
    Stats,
  ],
  template: `
    <div class="container">
      <app-clock></app-clock>
      <br>
      <stats></stats>
      <task-table></task-table>
    </div>
  `,
  styles: `
    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 5%;
      padding-right: 5%;
    }
  `
})
export class App implements OnInit, OnDestroy {

  protected readonly title = signal('ToDoApp20');
  public categories: categoriesInterface[] | null = null;
  public statuses: conditionInterface[] | null = null;
  public threatLevels: threatInterface[] | null = null;

  private dropdownSubscriptions: Subscription[] = [];

  constructor (
    @Inject(DOCUMENT) private document: Document,
    private titleService: Title,
    private metaService: Meta,
    private backend:BackendService,
    private dropdownService:DropdownDataService,
  ) {}

  ngOnInit(): void {
    const pageTitle = this.title()
    const canonicalUrl = this.document.location.href.split('?')[0];
    const tags: MetaDefinition[] = [
      { name: 'description', content: 'To-Do-App in Angular 20 with SSR.' },
      { property: 'og:title', content: pageTitle},
      { rel: 'canonical', href: canonicalUrl }
    ];
    this.titleService.setTitle(pageTitle);
    this.metaService.addTags(tags);

    forkJoin({
      categories: this.backend.getDropdownOptions<categoriesInterface[]>('categories'),
      status: this.backend.getDropdownOptions<conditionInterface[]>('status'),
      threats: this.backend.getDropdownOptions<threatInterface[]>('threats')
    }).subscribe({
      next: (result) => {
        this.dropdownService.setCategories(result.categories.data);
        this.dropdownService.setStatuses(result.status.data);
        this.dropdownService.setThreatLevels(result.threats.data);
      },
      error: (err) => console.error('Failed to load dropdowns', err)
    })
  }

  ngOnDestroy(): void {
    this.dropdownSubscriptions.forEach(sub => sub.unsubscribe());
  }
}
