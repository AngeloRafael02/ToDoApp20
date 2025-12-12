import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AsyncPipe } from '@angular/common';

import { categoriesInterface, conditionInterface, threatInterface } from '../../interfaces/forms.interface';
import { DropdownDataService } from '../../services/dropdown-data';
import { Observable } from 'rxjs';
import { taskViewInterface } from '../../interfaces/task.interface';

@Component({
  selector: 'task-form',
  imports: [
    AsyncPipe,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss'
})
export class TaskForm implements OnInit {

  private _task: taskViewInterface | undefined;
  
  @Input() 
  set task(taskData: taskViewInterface | undefined) {
    this._task = taskData;
    this.patchForm(); // Call a method to update the form when the task is set
  }

  get task(): taskViewInterface | undefined {
    return this._task;
  }

  public isModalOpen: boolean = false;
  public taskForm!: FormGroup;

  public categories$: Observable<categoriesInterface[] | null>;
  public statuses$: Observable<conditionInterface[] | null>;
  public threats$: Observable<threatInterface[] | null>;
  
  constructor(
    private fb: FormBuilder, 
    private snackBar: MatSnackBar,
    private dropdownService:DropdownDataService
  ) {}

  ngOnInit(): void {

    this.categories$ = this.dropdownService.categories$;
    this.statuses$ = this.dropdownService.statuses$;
    this.threats$ = this.dropdownService.threatLevels$;

    this.taskForm = this.fb.group({ 
      title:["", [Validators.required, Validators.maxLength(50)]],
      note:["",Validators.maxLength(255)],
      cat_id:[1,Validators.required],
      prio:[null, Validators.min(0)],
      threat_id:[1, Validators.required],
      stat_id:[1, Validators.required],
      created_at:[new Date(),Validators.required],
      last_edited:[new Date(),Validators.required],
      deadline:[''],
      owner_id:[1]
    });
  }

  patchForm(): void {
    if (this.task && this.taskForm) {
      this.taskForm.patchValue({
        title: this.task.Title,
        note: this.task.Description,
        cat_id:this.task.CID,
        prio:this.task.Priority,
        threat_id:this.task.TID,
        stat_id:this.task.SID,
        deadline:this.task.Deadline,
        owner_id:this.task.UID
      });
      
    } else if (this.taskForm) {
        this.taskForm.reset({
            title: '',
            note: '',
            cat_id: 1, 
            prio: null, 
            threat_id: 1, 
            stat_id: 1, 
            created_at: new Date(), 
            last_edited: new Date(), 
            deadline: '', 
            owner_id: 1
        });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      console.log('Task Data:', this.taskForm.value);
      this.isModalOpen = false; 
      this.snackBar.open('Task submitted successfully!', 'Dismiss', {
        duration: 3000,
        verticalPosition: 'top'
      });
      
      this.taskForm.reset({
        title: '',
        deadline: null,
        note: '',
        category: 1,
        prio: 1,
        threat: 1,
        status: 1,
      });

    } else {
      this.taskForm.markAllAsTouched();
      this.snackBar.open('Please correct the errors in the form.', 'Dismiss', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  }

  public hasError(controlName: string, errorType: string): boolean {
    const control = this.taskForm.get(controlName);
    return !!(control && control.hasError(errorType) && (control.dirty || control.touched));
  }
}
