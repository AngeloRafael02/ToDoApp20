import { Component, DOCUMENT, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { isPlatformBrowser } from '@angular/common';

import { Clock } from './components/clock/clock';
import { Stats } from './components/stats/stats';
import { DropdownDataService } from './services/dropdown-data/dropdown-data';
import { TaskRouter } from './components/table-router/task-router';
import { TasksService } from './services/tasks/tasks-service';
import { MatButtonModule } from '@angular/material/button';
import { AboutComponent } from './components/about/about';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle';
import { FooterComponent } from './components/footer/footer';
import { Auth } from './components/auth/auth';

@Component({
  selector: 'app-root',
  imports: [
    MatIconModule,
    MatButtonModule,
    Clock,
    TaskRouter,
    Stats,
    AboutComponent,
    ThemeToggleComponent,
    FooterComponent,
    Auth
  ],
  template: `
    <div class="container">
      <header class="header">
        <div>
          <h1>{{ title() }}</h1>
          <about></about>
          <theme-toggle class="mobile-only"></theme-toggle>
        </div>
        <app-clock></app-clock>
        <div>
          <theme-toggle class="pc-only"></theme-toggle>
          <!--<app-auth></app-auth>-->
        </div>
      </header>

      <stats></stats>

      <task-router></task-router>

    </div>
    <app-footer></app-footer>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    :host > .container {
      flex: 1 0 auto;
    }

    :host > app-footer {
      flex-shrink: 0;
    }

    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 1rem;
      padding-left: 5%;
      padding-right: 5%;
      padding-bottom: 2rem;
      padding-top: 2rem;

      .header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        text-align: center;

        /* Desktop View */
        @media (min-width: 768px) {
          flex-direction: row;
          justify-content: space-between;
          text-align: left;
          gap: 0rem;
        }

        div {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;

          @media (min-width: 768px) {
            justify-content: flex-start;
          }
        }

        .mobile-only {
          display: block;
          @media (min-width: 768px) {
            display: none;
          }
        }

        .pc-only {
          display: none;
          @media (min-width: 768px) {
            display: block;
          }
        }
      }
    }
  `
})
export class App implements OnInit {

  protected readonly title = signal('ToDoApp20');

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private titleService: Title,
    private metaService: Meta,
    private dropdownService: DropdownDataService,
    private taskService: TasksService
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.dropdownService.initializeDropdownData();
      this.taskService.queryAllTask(1);
    }
    this.setupMetadata();
  }

  private setupMetadata(): void {
    const pageTitle = this.title();
    const canonicalUrl = this.document.location.href.split('?')[0];
    const tags: MetaDefinition[] = [
      { name: 'description', content: 'To-Do-App in Angular 20 with SSR.' },
      { property: 'og:title', content: pageTitle },
      { rel: 'canonical', href: canonicalUrl }
    ];
    this.titleService.setTitle(pageTitle);
    this.metaService.addTags(tags);
  }
}
