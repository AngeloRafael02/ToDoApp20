import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterContentChecked, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { BackendService} from '../../services/backend/backend';
import { String } from '../../services/utils/string/string';
import { Date } from '../../services/utils/date/date';
import { Style } from '../../services/utils/style/style';
import { taskInterface, taskViewInterface } from '../../interfaces/task.interface';
import { TaskForm } from '../task-form/task-form';
import { Modal } from '../modal/modal';

@Component({
  selector: 'task-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
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
            <button mat-flat-button (click)="openTaskForm('create')">
              <mat-icon aria-hidden="false" aria-label="Add Task" fontIcon="add box"></mat-icon>
              New Task
            </button>
          </div>
        </caption>

          @for (col of taskColumns; track col) {
            <ng-container [matColumnDef]="col">
              <th mat-header-cell *matHeaderCellDef>  {{ col }} </th>
              @if (col == 'Options') {
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
                <td mat-cell *matCellDef="let element"> 
                  {{ col === 'Deadline' ? dateService.dateFormatHelper(element[col].toString()) : element[col].toString() }} 
                </td>
              }
            </ng-container>
          }

          <tr mat-header-row *matHeaderRowDef="taskColumns; sticky: true "></tr>
          <tr mat-row *matRowDef="let row; columns: taskColumns;" [ngClass]="evaluateDate(row)"></tr>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" [attr.colSpan]="taskColumns.length">No data found.</td>
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
          padding-bottom: 0.5rem;
          div {
            display: flex;
          }
        }
        th,td {
          text-align: center;
          &:first-child,
          &:nth-child(9),
          &:nth-child(10),
          &:nth-child(11) ~ th,
          &:nth-child(11) ~ td{
            display: none;
          }
        }
        th{
          background-color: tbl.$headerColor;
        }
        td{
          border: 1px solid black;
          div {
            button{
            margin-left:5px;
            padding-left:4%;
            padding-right:4%;
          }
        }
      }
    }  
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTable implements OnInit, AfterContentChecked {

  public title:string = 'Current';

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
    public stringService:String,
    public backendService:BackendService,
    public styleService:Style,
    private cdr: ChangeDetectorRef
  ){
    this.backendService.getHeaders<{column_name:string}[]>('task_view').subscribe(object => {
      this.taskColumns = object.data.map(obj => obj.column_name)
      this.headersOrderMapping.forEach((item,index)=>{
        this.taskColumns = this.stringService.rearrangeArrayItem(this.taskColumns,item,index+1)
      })
      this.taskColumns = this.stringService.insertArrayAtIndex(this.taskColumns,["Options"],10)
    });
  }

  public dateService = inject(Date)

  ngOnInit(): void {
    this.refreshTable();
  }
  
  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
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

  public refreshTable(): void {
    this.backendService.getTableTasks<taskViewInterface[]>(1, 1).subscribe({
      next: (data) => {
        this.tasks = data.data;
        this.tasksSource.data = this.tasks;
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
      error: (err) => console.error(`Error Deleteing task`, err);
    });
  }

  public finishTask(id:number) {
    this.backendService.finishOneTask(id).subscribe({
      next: (data) => this.refreshTable(), 
      error: (err) => console.error('Error Completing Task', err);
    });
  }

  public evaluateDate(row:taskViewInterface):string {
    return this.styleService.RowColorPerDeadline(row.Deadline);
  }
}
