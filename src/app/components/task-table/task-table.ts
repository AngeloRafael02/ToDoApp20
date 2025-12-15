import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { BackendService} from '../../services/backend/backend';
import { String } from '../../services/utils/string/string';
import { Date } from '../../services/utils/date/date';
import { Style } from '../../services/utils/style/style';
import { taskInterface, tasksOrMessage, taskViewInterface } from '../../interfaces/task.interface';
import { messageInterface } from '../../interfaces/message.interface';
import { TaskForm } from '../task-form/task-form';
import { Modal } from '../modal/modal';

@Component({
  selector: 'task-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
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
            <button mat-flat-button (click)="openTaskForm('create')">New Task</button>
          </div>
        </caption>

          @for (col of taskColumns; track col) {
            <ng-container [matColumnDef]="col">
              <th mat-header-cell *matHeaderCellDef>  {{ col }} </th>
              @if (col == 'Options') {
                <td mat-cell *matCellDef="let element"> 
                  <div  style="display: flex;">
                    <button mat-flat-button color="primary">Finish</button>
                    <button mat-flat-button color="primary" (click)="openTaskForm('edit', element['ID'])">Update</button>
                    <button mat-flat-button color="success">Delete</button>
                  </div>
                </td>
              } @else {
                <td mat-cell *matCellDef="let element"> 
                  {{ col == 'Deadline' || col == 'Created At' ? deadlineFormatHelper(element.ID) : element[col] }} 
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
        margin: 0em 2em 0em 2em;
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
          &:nth-child(11) ~ td{ /* Using the parent selector '&' */
            display: none;
          }
        }
        th{
          background-color: tbl.$headerColor;
        }
        td{
          border: 1px solid black;
          button{
            width: 50px; 
            margin-left:5px;
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

  constructor(
    public stringService:String,
    public backendService:BackendService,
    public dateService:Date,
    public styleService:Style,
    private cdr: ChangeDetectorRef
  ){
    this.backendService.getColumnHeaders('task_view').subscribe(data => {
      this.taskColumns = data;
      this.taskColumns = this.stringService.insertArrayAtIndex(this.taskColumns,["Options"],10)
    });
  }

  private isErrorMessage(obj:tasksOrMessage):obj is messageInterface {
    return 'message' in obj && typeof (obj as messageInterface).message === 'string';
  }

  ngOnInit(): void {
    this.backendService.getTasks(1).subscribe(data => {
      if (!this.isErrorMessage(data)){
        this.tasks = data;
        this.tasksSource.data = this.tasks;
      } else {
        alert(data.message);
      }
    })
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

  public closeTaskForm(taskData:taskInterface): void {
    if (taskData) {
      if (taskData.id) {
        this.backendService.updateOneTask(taskData,taskData.id as number)
        console.log('Update existing task:', taskData);
      } else {
        this.backendService.addTask(taskData);
        console.log('Create new task:', taskData);
      }
    }
  this.isModalOpen = false;
  }

  public deadlineFormatHelper(deadline:string):string{
    return this.dateService.dateFormatHelper(deadline);
  }

  public evaluateDate(row:taskViewInterface):string {
    return this.styleService.RowColorPerDeadline(row.Deadline);
  }
}
