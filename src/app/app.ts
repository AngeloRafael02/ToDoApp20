import { Component, DOCUMENT, Inject, OnInit, signal } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';

import { Clock } from './components/clock/clock';
import { Stats } from './components/stats/stats';
import { DropdownDataService } from './services/dropdown-data/dropdown-data';
import { TaskRouter } from './components/table-router/task-router';
import { TasksService } from './services/tasks/tasks-service';
import { MatButtonModule } from '@angular/material/button';
import { Modal } from './components/modal/modal';
import { AboutComponent } from './components/about/about';
@Component({
  selector: 'app-root',
  imports: [
    MatIconModule,
    MatButtonModule,
    Clock,
    TaskRouter,
    Stats,
    Modal,
    AboutComponent
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>{{ title() }}</h1>
        <button matMiniFab>
          <mat-icon aria-hidden="false" aria-label="Web App Help" fontIcon="help" (click)="isAboutComponentVisible = true"></mat-icon>
        </button>
      </div>
      <app-clock></app-clock>
      <stats></stats>
      <task-router></task-router>
    </div>
    <modal [visible]="isAboutComponentVisible" [title]="'About'" (close)="isAboutComponentVisible=false" [width]="'600px'">
      <about></about>
    </modal>
  `,
  styles: `
    @use './styles/pallete.scss' as pallete;

    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 1rem;
      padding-left: 5%;
      padding-right: 5%;

      .header {
        display:flex;
        flex-direction: row;
        justify-content: left;
        align-items: center;
        gap: 0.5rem;

        h1 {
          color:pallete.$primaryTextColor;
        }

        button {
          background-color: transparent;
          box-shadow: none;
          color:white;
        }
      }
    }
  `
})
export class App implements OnInit {

  protected readonly title = signal('ToDoApp20');
  public isAboutComponentVisible:boolean = false;

  constructor (
    @Inject(DOCUMENT) private document: Document,
    private titleService: Title,
    private metaService: Meta,
    private dropdownService: DropdownDataService,
    private taskService:TasksService
  ) {}

  ngOnInit(): void {
    this.dropdownService.initializeDropdownData();
    this.taskService.queryAllTask(1);
    this.setupMetadata();
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
