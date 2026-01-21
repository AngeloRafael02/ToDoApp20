import { CommonModule } from '@angular/common';
import { AfterViewInit, ViewChild } from '@angular/core';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router } from '@angular/router';

import { BackendService} from '../../services/backend/backend';
import { StringService } from '../../services/utils/string/string';
import { DateService } from '../../services/utils/date/date';
import { StyleService } from '../../services/utils/style/style';
import { taskInterface, taskViewInterface } from '../../interfaces/task.interface';
import { TaskForm } from '../task-form/task-form';
import { Modal } from '../modal/modal';
import { DropdownDataService } from '../../services/dropdown-data/dropdown-data';
import { categoriesInterface, conditionInterface, threatInterface } from '../../interfaces/forms.interface';
import { take } from 'rxjs';

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
    MatChipsModule,
    MatDividerModule,
    Modal,
    TaskForm
  ],
  template: `
    <div class="tableContainer">
      <table mat-table multiTemplateDataRows [dataSource]="tasksSource" matSort matSortActive="Deadline" matSortDirection="desc" class="mat-table mat-elevation-z8">
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
                    @if (title !== 'Finished') {
                      <button mat-flat-button color="primary" (click)="finishTask(element['ID'])">
                        <mat-icon aria-hidden="false" aria-label="Finish Task" fontIcon="done"></mat-icon>
                        <span class="button-text">Finish</span>
                      </button>
                    }
                    <button mat-flat-button color="primary" (click)="openTaskForm('edit', element['ID'])">
                      <mat-icon aria-hidden="false" aria-label="Edit Task" fontIcon="edit"></mat-icon>
                      <span class="button-text">Update</span>
                    </button>
                    <button mat-flat-button color="success" (click)="requestDelete(element['ID'])">
                      <mat-icon aria-hidden="false" aria-label="Delete Task" fontIcon="delete"></mat-icon>
                      <span class="button-text">Delete</span>
                    </button>
                  </div>
                </td>
              } @else {
                <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ col }} </th>
                <td mat-cell *matCellDef="let element">
                  {{ col === 'Deadline' ? dateService.dateFormatHelper(element[col]) : element[col] }}
                </td>
              }
            </ng-container>
          }

          <ng-container matColumnDef="expandedDetail">
            <td mat-cell *matCellDef="let element" [attr.colspan]="taskColumns.length">
              <div class="detail-container" [class.expanded]="expandedTask === element">
                <div class="detail-content">
                  <mat-chip-set aria-label="Fish selection">
                    <mat-chip [style.backgroundColor]="getCellSpecificColor('Category', element)">{{ element.Category }}</mat-chip>
                    <mat-chip [style.backgroundColor]="styleService.PriorityColor(+element.Priority)">Priority: {{ element.Priority == null ? 'None' : element.Priority}}</mat-chip>
                    <mat-chip [style.backgroundColor]="getCellSpecificColor('Status', element)">{{ element.Status }}</mat-chip>
                    <mat-chip [style.backgroundColor]="getCellSpecificColor('Threat Level', element)">{{ element['Threat Level'] }}</mat-chip>
                  </mat-chip-set>
                  <mat-divider></mat-divider>
                  <div>
                    <strong>Description: </strong>{{element.Description}}
                  </div>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="footer">
            <td mat-footer-cell *matFooterCellDef [attr.colspan]="taskColumns.length" style="color:pallete.$primaryTextColor; !important; display: table-cell !important;">
              <div class="footer-wrapper">
                <strong>Total Tasks: {{ tasksSource.data.length }}</strong>
                <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons aria-label="Select page of tasks"></mat-paginator>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="taskColumns; sticky: true "></tr>
          <tr mat-row *matRowDef="let row; columns: taskColumns;"
            class="element-row"
            [class.expanded-row]="expandedTask === row"
            (click)="toggleRow(row)"
            [style.backgroundColor]="styleService.RowColorPerDeadline(row.Deadline)"
            [style.Height.rem]="3"></tr>
          <tr mat-row *matRowDef="let row; columns: ['expandedDetail']" class="detail-row" ></tr>
          <tr mat-footer-row *matFooterRowDef="['footer']; sticky: true"></tr>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" [attr.colSpan]="taskColumns.length" style="color:pallete.$primaryTextColor; !important; display: table-cell !important;">
              No data found.
            </td>
          </tr>

        </table>

        <modal [title]="stringService.titlecase(formModalMode) + ' Task'" [visible]="isModalOpen" (close)="isModalOpen = false">
          <task-form [task]="selectedTask" (taskSubmitted)="closeTaskForm($event)"></task-form>
        </modal>

        <modal [title]="'Confirm Deletion'" [visible]="isDeleteModalOpen" (close)="cancelDelete()">
          <div style="padding: 1rem 0;">
            <p>Are you sure you want to delete this task? This action cannot be undone and will be removed permanently.</p>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button mat-button (click)="cancelDelete()">Cancel</button>
            <button mat-button (click)="confirmDelete()">
              Confirm Delete
            </button>
          </div>
        </modal>
    </div>
  `,
  styles: `
    @use '../../styles/pallete.scss' as pallete;
    @use '../../styles/table-colors.scss' as tbl;

    table  {
        margin-top:1rem;
        border: 2px solid black;
        caption {
          caption-side: top;
          color:pallete.$primaryTextColor;
          padding-top: -1rem;
          padding-bottom: -1rem;
          div {
            display: flex;
            gap: 1rem;
          }
        }
        tr {
          .mat-footer-row {
            font-weight: bold;
            border-top: 1px solid black;
          }
        }
        th,td {
          text-align: center;
          border-left: 0.5px solid black;
          border-right: 0.5px solid black;
        }
        th {
          border-bottom: 2px solid black;
          background-color: tbl.$headerColor;
        }
        td {
          border-top: 0.5px solid black;
          .mat-footer-cell {
            padding: 0 16px;
          }
          .footer-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            mat-paginator {
              background: transparent;
              border: none;
            }
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

    ::ng-deep .mat-sort-header-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .detail-row {
      height: 0;
    }

    .detail-container  {
      overflow: hidden;
      display: flex;
      transition: max-height 0.3s ease-out, opacity 0.2s ease;
      max-height: 0;
      opacity: 0;
      background-color: #fafafa;
      .detail-content{
        width: 100%;
        text-align:left;
      }
    }

    .detail-container.expanded {
      max-height: 1000px;
      opacity: 1;
      padding: 15px;
      overflow-y: visible;
    }

    .element-row {
      cursor: pointer;
    }

    @media (max-width: 600px) {
      .button-text {
        display: none;
      }

      table td div button {
        min-width: 40px;
        margin-left: 2px;
      }

      th, td {
        padding: 2px !important;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTable implements  AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public title:string = 'Unfinished';
  private status:number = 0;

  private categories: categoriesInterface[] = [];
  private statuses: conditionInterface[] = [];
  private threatLevels: threatInterface[] = [];

  // Table State
  private tasks:taskViewInterface[] = []
  public taskColumns:string[] = [];
  public tasksSource:MatTableDataSource<taskViewInterface> = new MatTableDataSource(this.tasks);

  //Expanded Row State
  public expandedTask: taskViewInterface | null = null;
  //Form Modal State
  public isModalOpen:boolean = false;
  public formModalMode:'create'|'edit' = 'create';
    public selectedTask: taskViewInterface | undefined;
  //Delete Modal States
  public isDeleteModalOpen: boolean = false;
  public taskIdToDelete: number | null = null;

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
    this.title = this.route.snapshot.paramMap.get('status') || 'Unfinished';
    this.route.params.subscribe(params => {
      this.title = params['status'] || 'Unfinished';
      this.updateTableData();
    });
    this.setupHeaders()
    this.dropdownService.categories$.subscribe(data => this.categories = data || []);
    this.dropdownService.threatLevels$.subscribe(data => this.threatLevels = data || []);
  }

  ngAfterViewInit(): void {
    this.tasksSource.sort = this.sort;
    this.tasksSource.paginator = this.paginator;
  }

  public openTaskForm(mode:'create'|'edit' = 'create', id:number = 0) {
    this.isModalOpen = true;
    this.formModalMode = mode;
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
      let columns = object.data.map(obj => obj.column_name);
      this.headersOrderMapping.forEach((item, index) => {
        columns = this.stringService.rearrangeArrayItem(columns, item, index);
      });
      this.taskColumns = columns.slice(0, 3);
      this.taskColumns.push("Options");
      this.taskColumns.splice(1,1) //remove Description column
      this.tasksSource.sortingDataAccessor = (item, property) => {
        return (item as any)[property];
      };
      this.cdr.markForCheck();
    });
  }

  public toggleRow(task: taskViewInterface) {
    this.expandedTask = this.expandedTask === task ? null : task;
    this.cdr.markForCheck();
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

  public getCellSpecificColor(col: string, element: any): string | null {
    let sourceArray: any[] = [];
    let idValue: number;
    switch (col) {
      case 'Category':
        sourceArray = this.categories;
        idValue = element.CID;
        break;
      case 'Status':
        sourceArray = this.statuses;
        idValue = element.SID;
        break;
      case 'Threat Level':
        sourceArray = this.threatLevels;
        idValue = element.TID;
        break;
      default:
        return null;
    }
    const match = sourceArray.find(item => item.id === idValue);
    return match ? `#${match.color}` : null;
  }

  public requestDelete(id: number) {
    this.taskIdToDelete = id;
    this.isDeleteModalOpen = true;
  }

  public confirmDelete() {
    if (this.taskIdToDelete !== null) {
      this.backendService.deleteOneTask(this.taskIdToDelete).subscribe({
        next: () => {
          this.refreshTable();
          this.cancelDelete();
        },
        error: (err) => console.error(`Error deleting task`, err)
      });
    }
  }

  public cancelDelete() {
    this.isDeleteModalOpen = false;
    this.taskIdToDelete = null;
  }

  private updateTableData() {
    this.dropdownService.statuses$.pipe(take(1)).subscribe(statuses => {
      if (!statuses) return;
      const currentTitle = decodeURIComponent(this.title).toLowerCase();

      if (currentTitle === 'all') {
        this.status = 0;
        this.refreshTable();
        return;
      }

      const match = statuses.find(s => s.stat.toLowerCase() === currentTitle);
      if (match) {
        this.status = match.id;
        this.refreshTable();
      } else {
        this.router.navigate(['/Error'], { skipLocationChange: true });
      }
    });
  }
}
