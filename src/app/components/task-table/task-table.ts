import { CommonModule } from '@angular/common';
import { AfterViewInit, Input, ViewChild } from '@angular/core';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterContentChecked, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { BackendService} from '../../services/backend/backend';
import { StringService } from '../../services/utils/string/string';
import { DateService } from '../../services/utils/date/date';
import { StyleService } from '../../services/utils/style/style';
import { taskInterface, taskViewInterface } from '../../interfaces/task.interface';
import { TaskForm } from '../task-form/task-form';
import { Modal } from '../modal/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownDataService } from '../../services/dropdown-data/dropdown-data';

@Component({
  selector: 'task-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    Modal,
    TaskForm
  ],
  template: `
    <div class="tableContainer">
      <table mat-table [dataSource]="tasksSource" matSort matSortActive="Deadline" matSortDirection="desc" class="mat-table mat-elevation-z8">
        <caption>
          <h2>{{title}} Tasks Table</h2>
          <p>A list of all {{title | lowercase}} tasks.</p>
          <div>
            <mat-form-field style="margin-bottom: -1.25em;">
              <mat-label>Filter</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Filter" #input>
            </mat-form-field>
            <button mat-flat-button (click)="openTaskForm('create')">
              <mat-icon aria-hidden="false" aria-label="Add Task" fontIcon="add box"></mat-icon>
              New Task
            </button>
          </div>
        </caption>
          @for (col of taskColumns; track col) {
            <ng-container [matColumnDef]="col">
              @if (col == 'Options') {
                <th mat-header-cell *matHeaderCellDef> {{ col }} </th>
                <td mat-cell *matCellDef="let element">
                  <div>
                    <button mat-flat-button color="primary" (click)="finishTask(element['ID'])">
                      <mat-icon aria-hidden="false" aria-label="Finish Task" fontIcon="done"></mat-icon>
                      Finish
                    </button>
                    <button mat-flat-button color="primary" (click)="openTaskForm('edit', element['ID'])">
                      <mat-icon aria-hidden="false" aria-label="Edit Task" fontIcon="edit"></mat-icon>
                      Update
                    </button>
                    <button mat-flat-button color="success" (click)="deleteTask(element['ID'])">
                      <mat-icon aria-hidden="false" aria-label="Delete Task" fontIcon="delete"></mat-icon>
                      Delete
                    </button>
                  </div>
                </td>
              } @else {
                <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ col }} </th>
                <td mat-cell *matCellDef="let element" [style.backgroundColor]="getCellSpecificColor(col, element)">
                  {{ col === 'Deadline' ? dateService.dateFormatHelper(element[col]) : element[col] }}
                </td>
              }
            </ng-container>
          }

          <tr mat-header-row *matHeaderRowDef="taskColumns; sticky: true "></tr>
          <tr mat-row *matRowDef="let row; columns: taskColumns;" [style.backgroundColor]="styleService.RowColorPerDeadline(row.Deadline)"></tr>

          <ng-container matColumnDef="footer">
            <td mat-footer-cell *matFooterCellDef [attr.colspan]="taskColumns.length" style="color:pallete.$primaryTextColor; !important; display: table-cell !important;">
              <div class="footer-wrapper">
                <strong>Total Tasks: {{ tasksSource.data.length }}</strong>
                <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons aria-label="Select page of tasks"></mat-paginator>
              </div>
            </td>
          </ng-container>

          <tr mat-footer-row *matFooterRowDef="['footer']; sticky: true"></tr>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" [attr.colSpan]="taskColumns.length" style="color:pallete.$primaryTextColor; !important; display: table-cell !important;">
              No data found.
            </td>
          </tr>

        </table>

        <modal [title]="'New Task'" [visible]="isModalOpen" (close)="isModalOpen = false">
          <task-form [task]="selectedTask" (taskSubmitted)="closeTaskForm($event)"></task-form>
        </modal>
    </div>
  `,
  styles: `
    @use '../../styles/pallete.scss' as pallete;
    @use '../../styles/table-colors.scss' as tbl;

    table,th,td   {
        border: 1px solid black;
        caption {
          caption-side: top;
          color:pallete.$primaryTextColor;
          padding-top: 0.5rem;
          padding-bottom: -1rem;
          div {
            display: flex;
            gap: 1rem;
          }
        }
        tr {
          .mat-footer-row {
          font-weight: bold;
          background-color: #f5f5f5;
        }
        }
        th,td {
          text-align: center;
          &:first-child:not(.no-data-cell),
          &:nth-child(9),
          &:nth-child(10),
          &:nth-child(11) ~ th,
          &:nth-child(11) ~ td {
            display: none;
          }
        }
        th {
          background-color: tbl.$headerColor;
        }
        td {
          .mat-footer-cell {
            padding: 0 16px;
            background-color: transparent;
            border: 1px solid black;
          }
          div {
            button{
            margin-left:5px;
            padding-left:4%;
            padding-right:4%;
          }
        }
      }
    }

    .footer-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    mat-paginator {
      border: 2px solid black;
      border-top: 1px solid black;
      background: transparent !important;
      border: none !important;
    }

    ::ng-deep .mat-sort-header-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    ::ng-deep .mat-mdc-paginator-container {
      min-height: auto !important;
      padding: 0 !important;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTable implements OnInit, AfterContentChecked, AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public title:string = 'Current';
  private status:number = 0;
  private tasks:taskViewInterface[] = []
  public taskColumns:string[] = [];
  public tasksSource:MatTableDataSource<taskViewInterface> = new MatTableDataSource(this.tasks);
  public selectedTask: taskViewInterface | undefined;
  public isModalOpen:boolean = false;
  public modalMode:'create'|'edit' = 'create';

  private headersOrderMapping:string[] = [
    "Title",
    "Description",
    "Deadline",
    "Category",
    "Priority",
    "Status",
    "Threat Level",
  ];

  constructor(
    public stringService:StringService,
    public backendService:BackendService,
    public dateService:DateService,
    public styleService:StyleService,
    public dropdownService:DropdownDataService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.title = this.route.snapshot.paramMap.get('status') || 'Current';
    this.setupHeaders()
    this.dropdownService.statuses$.subscribe(statuses => {
    if (statuses) {
      const match = statuses.find(s => s.stat.toLowerCase() === this.title.toLowerCase());
      if (match) {
        this.status = match.id;
        this.refreshTable();
      } else {
        this.router.navigate(['/Error'], { skipLocationChange: true });
      }
    }
  });
  }

  ngOnInit(): void {
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.tasksSource.sort = this.sort;
    this.tasksSource.paginator = this.paginator;
  }


  public openTaskForm(mode:'create'|'edit' = 'create', id:number = 0) {
    this.isModalOpen = true;
    this.modalMode = mode;
    this.selectedTask = undefined;
    if (mode === 'edit') {
      this.selectedTask = this.tasks.find(task => task.ID === id);
      if (this.selectedTask) {
        console.log('Selected Task for Edit:', this.selectedTask);
      } else {
        console.error(`Task with ID ${id} not found.`);
      }
    }
  }

  public closeTaskForm(taskData: taskInterface): void {
    if (taskData) {
      if (taskData.id) {
        this.backendService.updateOneTask(taskData, taskData.id as number).subscribe({
          next: () => {
            this.refreshTable();
            this.isModalOpen = false;
          },
          error: (err) => console.error('Update failed', err)
        });
      } else {
        this.backendService.addTask(taskData).subscribe({
          next: () => {
            this.refreshTable();
            this.isModalOpen = false;
          },
          error: (err) => console.error('Creation failed', err)
        });
      }
    } else {
      this.isModalOpen = false;
    }
  }

  public setupHeaders() {
    this.backendService.getHeaders<{column_name:string}[]>('task_view').subscribe(object => {
      this.taskColumns = object.data.map(obj => obj.column_name);
      this.headersOrderMapping.forEach((item,index)=>{
        this.taskColumns = this.stringService.rearrangeArrayItem(this.taskColumns,item,index+1)
      });
      this.taskColumns = this.stringService.insertArrayAtIndex(this.taskColumns,["Options"],10);
      this.tasksSource.sortingDataAccessor = (item, property) => {
        return (item as any)[property];
      };
    });
  }

  public refreshTable(): void {
    this.backendService.getTableTasks<taskViewInterface[]>(1,this.status).subscribe({
      next: (data) => {
        this.tasks = data.data;
        this.tasksSource.data = this.tasks;
        this.tasksSource.sort = this.sort;
        this.tasksSource.paginator = this.paginator;
        this.cdr.markForCheck();
        console.log('Table refreshed successfully');
      },
      error: (err) => {
        console.error('Error refreshing table:', err);
      }
    });
  }

  public deleteTask(id:number) {
    this.backendService.deleteOneTask(id).subscribe({
      next:(data)=> this.refreshTable(),
      error: (err) => console.error(`Error Deleteing task`, err)
    });
  }

  public finishTask(id:number) {
    this.backendService.finishOneTask(id).subscribe({
      next: (data) => this.refreshTable(),
      error: (err) => console.error('Error Completing Task', err)
    });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tasksSource.filter = filterValue.trim().toLowerCase();
    this.cdr.markForCheck();
  }

  public getCellColor(col: string, element: any): string | null {
    const colorMaps: Record<string, { key: string, colors: string[] }> = {
      'Category':     { key: 'CID', colors: this.styleService.categoryCellColors },
      'Status':       { key: 'SID', colors: this.styleService.statusCellColors },
      'Threat Level': { key: 'TID', colors: this.styleService.threatCellColors }
    };
    const config = colorMaps[col];
    return config ? config.colors[element[config.key] - 1] : null;
  }

  public getCellSpecificColor(col: string, element: any): string | null {
    const config: Record<string, { idKey: string, colors: string[] }> = {
      'Category':     { idKey: 'CID', colors: this.styleService.categoryCellColors },
      'Status':       { idKey: 'SID', colors: this.styleService.statusCellColors },
      'Threat Level': { idKey: 'TID', colors: this.styleService.threatCellColors }
    };

    const settings = config[col];
    if (settings) {
      const idValue = element[settings.idKey];
      return settings.colors[idValue - 1] || null;
    }

    return null;
  }
}
