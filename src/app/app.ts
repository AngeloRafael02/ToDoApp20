import { Component, DOCUMENT, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';

import { Clock } from './components/clock/clock';
import { TaskTable } from './components/task-table/task-table';
import { BackendService } from './services/backend/backend';
import { categoriesInterface, conditionInterface, threatInterface } from './interfaces/forms.interface';
import { Observable, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DropdownDataService } from './services/dropdown-data';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatGridListModule,
    Clock,
    TaskTable
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
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
    
    this.loadDropdownItem('categories', 'categories');
    this.loadDropdownItem('status', 'statuses');
    this.loadDropdownItem('threat level', 'threatLevels');
  }

  ngOnDestroy(): void {
    this.dropdownSubscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadDropdownItem<T>(serviceOption: string, propertyName: keyof App): void {
    const itemObservable = this.backend.getDropdownItems(serviceOption) as Observable<T[]>;
    const sub = itemObservable.subscribe({
      next: (data: T[]) => {
          if (propertyName === 'categories') {
              this.dropdownService.setCategories(data as categoriesInterface[]);
          } else if (propertyName === 'statuses') {
              this.dropdownService.setStatuses(data as conditionInterface[]);
          } else if (propertyName === 'threatLevels') {
              this.dropdownService.setThreatLevels(data as threatInterface[]);
          }
          //console.log(`${serviceOption} loaded:`, data);
      },
      error: (err: HttpErrorResponse) => console.error(`Error fetching ${serviceOption}:`, err)
    });
    this.dropdownSubscriptions.push(sub);
  }
}