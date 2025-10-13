import { Component, DOCUMENT, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet,RouterModule, Router, NavigationEnd } from '@angular/router';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { MatDialog,MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';

import { Clock } from './components/clock/clock';
import { TaskTable } from './components/task-table/task-table';

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

  constructor (
    @Inject(DOCUMENT) private document: Document,
    private titleService: Title,
    private metaService: Meta
  ) {

  }

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
  }

  ngOnDestroy(): void {
    
  }
}
