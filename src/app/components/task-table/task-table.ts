import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CdkColumnDef } from '@angular/cdk/table';


import { BackendService} from '../../services/backend/backend';
import { String } from '../../services/misc/string/string';
import { Date } from '../../services/misc/date/date';
import { Style } from '../../services/misc/style/style';
import { taskViewInterface } from '../../interfaces/task.interface';

@Component({
  selector: 'task-table',
  providers:[
    CdkColumnDef
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
  ],
  templateUrl: './task-table.html',
  styleUrl: './task-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTable implements OnInit, OnChanges, OnDestroy {


  private tasks:taskViewInterface[] = [] 
  public taskColumns:string[] = [];
  public tasksSource:MatTableDataSource<taskViewInterface> = new MatTableDataSource(this.tasks);

  constructor(
    public stringService:String,
    public backendService:BackendService,
    public dateService:Date,
    public styleService:Style
  ){
    this.backendService.getColumnHeaders('task_view').subscribe(data => {
      this.taskColumns = data;
      this.taskColumns = this.stringService.insertArrayAtIndex(this.taskColumns,["Options"],10)
    });
  }

  ngOnInit(): void {
    this.backendService.getTasks(1).subscribe(data => {
      console.log(data);
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
    
  }


  public deadlineFormatHelper(deadline:string):string{
    return this.dateService.dateFormatHelper(deadline);
  }

  public evaluateDate(row:taskViewInterface):string {
    return this.styleService.RowColorPerDeadline(row.Deadline);
  }
}
