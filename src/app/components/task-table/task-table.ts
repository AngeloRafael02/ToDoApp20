import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { BackendService} from '../../services/backend/backend';
import { String } from '../../services/misc/string/string';
import { Date } from '../../services/misc/date/date';
import { Style } from '../../services/misc/style/style';
import { tasksOrMessage, taskViewInterface } from '../../interfaces/task.interface';
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
  templateUrl: './task-table.html',
  styleUrl: './task-table.scss',
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

  public deadlineFormatHelper(deadline:string):string{
    return this.dateService.dateFormatHelper(deadline);
  }

  public evaluateDate(row:taskViewInterface):string {
    return this.styleService.RowColorPerDeadline(row.Deadline);
  }
}
