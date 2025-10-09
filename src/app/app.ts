import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet,RouterModule, Router, NavigationEnd } from '@angular/router';
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

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }
}
