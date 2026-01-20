import { Component, DOCUMENT, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { Clock } from './components/clock/clock';
import { Stats } from './components/stats/stats';
import { categoriesInterface, conditionInterface, threatInterface } from './interfaces/forms.interface';
import { DropdownDataService } from './services/dropdown-data/dropdown-data';
import { taskViewInterface } from './interfaces/task.interface';
import { TaskRouter } from './components/table-router/task-router';

@Component({
  selector: 'app-root',
  imports: [
    Clock,
    TaskRouter,
    Stats,
  ],
  template: `
    <div class="container">
      <app-clock></app-clock>
      <stats></stats>
      <task-router></task-router>
    </div>
  `,
  styles: `
    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 1rem;
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
  public allTasks: taskViewInterface[] | null = null;
  private subscriptions: Subscription[] = [];

  constructor (
    @Inject(DOCUMENT) private document: Document,
    private titleService: Title,
    private metaService: Meta,
    private dropdownService: DropdownDataService,
  ) {}

  ngOnInit(): void {
    this.setupMetadata();
    this.subscribeToStore();
    this.dropdownService.initializeDropdownData()
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private subscribeToStore(): void {
    this.subscriptions.push(
      this.dropdownService.categories$.subscribe(val => this.categories = val),
      this.dropdownService.statuses$.subscribe(val => this.statuses = val),
      this.dropdownService.threatLevels$.subscribe(val => this.threatLevels = val),
    );
  }

  private setupMetadata(): void {
    const pageTitle = this.title();
    const canonicalUrl = this.document.location.href.split('?')[0];
    const tags: MetaDefinition[] = [
      { name: 'description', content: 'To-Do-App in Angular 20 with SSR.' },
      { property: 'og:title', content: pageTitle},
      { rel: 'canonical', href: canonicalUrl }
    ];
    this.titleService.setTitle(pageTitle);
    this.metaService.addTags(tags);
  }
}
