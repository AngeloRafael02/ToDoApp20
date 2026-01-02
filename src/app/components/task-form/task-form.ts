import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
import { Observable } from 'rxjs';

import { categoriesInterface, conditionInterface, threatInterface } from '../../interfaces/forms.interface';
import { DropdownDataService } from '../../services/dropdown-data/dropdown-data';
import { taskInterface, taskViewInterface } from '../../interfaces/task.interface';

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
  template: `
    <form [formGroup]="taskForm" (ngSubmit)="onSubmit()"> 
        <mat-dialog-content>
            <mat-grid-list cols="2" rowHeight="100px" gutterSize="10px">
                
                <mat-grid-tile colspan="1">
                    <mat-form-field>
                        <mat-label>Task</mat-label>
                        <input matInput formControlName="title">
                        @if(hasError('title', 'required')){
                            <mat-error>
                                Task title is **required**.
                            </mat-error>
                        }
                        @if(hasError('title', 'minlength')){
                            <mat-error>
                                Title must be at least 3 characters.
                            </mat-error>
                        }
                    </mat-form-field>
                </mat-grid-tile>

                <mat-grid-tile colspan="1">
                    <mat-form-field>
                        <mat-label>Deadline</mat-label>
                        <input matInput [matDatepicker]="picker3" formControlName="deadline">
                        <mat-hint>MM/DD/YYYY</mat-hint>
                        <mat-datepicker-toggle matIconSuffix [for]="picker3"></mat-datepicker-toggle>
                        <mat-datepicker #picker3></mat-datepicker>
                    </mat-form-field>    
                </mat-grid-tile>

                <mat-grid-tile colspan="2">
                    <mat-form-field [style.width.px]=440>
                        <mat-label>Description</mat-label>
                        <textarea matInput formControlName="note" style="resize: none;"></textarea>
                        @if (hasError('note', 'required')) {
                            <mat-error>
                                Description is **required**.
                            </mat-error>
                        }
                    </mat-form-field>
                </mat-grid-tile>

                <mat-grid-tile colspan="1">
                    <mat-form-field>
                        <mat-label>Category</mat-label>
                        <mat-select formControlName="cat_id">
                            @if (categories$ | async; as categories) {
                                @for (category of categories; track category.id) {
                                    <mat-option [value]="category.id">{{category.cat}}</mat-option>
                                }
                            } @else {
                                <mat-option disabled>Loading categories...</mat-option>
                            }
                        </mat-select>
                        @if(hasError('cat_id', 'required')){
                            <mat-error>
                                Category is **required**.
                            </mat-error>
                        }
                    </mat-form-field>
                </mat-grid-tile>

                <mat-grid-tile colspan="1">
                    <mat-form-field>
                        <mat-label>Priority</mat-label>
                        <input matInput type="number" min="0" formControlName="prio" placeholder="Enter a number">
                        @if (hasError('prio', 'required') ) {
                            <mat-error>
                                Priority is **required**.
                            </mat-error>
                        }
                        @if (hasError('prio', 'min')) {
                            <mat-error>
                                Priority must be a number greater than 0.
                            </mat-error>
                        }
                    </mat-form-field>
                </mat-grid-tile>

                <mat-grid-tile colspan="1">
                    <mat-form-field>
                        <mat-label>Threat Level</mat-label>
                        <mat-select formControlName="threat_id">
                            @if (threats$ | async; as threats) {
                                @for (threat of threats; track threat.id) {
                                    <mat-option [value]="threat.id">{{threat.level}}</mat-option>
                                }
                            } @else {
                                <mat-option disabled>Loading threat levels...</mat-option>
                            }
                        </mat-select>
                        @if(hasError('threat_id', 'required')){
                            <mat-error>Threat Level is **required**.</mat-error>
                        }
                    </mat-form-field>
                </mat-grid-tile>

                <mat-grid-tile colspan="1">
                    <mat-form-field>
                        <mat-label>Status</mat-label>
                        <mat-select formControlName="stat_id">
                            @if (statuses$ | async; as statuses) {
                                @for (status of statuses; track status.id) {
                                    <mat-option [value]="status.id">{{status.stat}}</mat-option>
                                }
                            } @else {
                                <mat-option disabled>Loading statuses...</mat-option>
                            }
                        </mat-select>
                        @if(hasError('stat_id', 'required')){
                            <mat-error>Status is **required**.</mat-error>
                        }
                    </mat-form-field>
                </mat-grid-tile>

            </mat-grid-list>
        </mat-dialog-content>
        <mat-dialog-actions>
            <button mat-flat-button class="modalBTN" type="submit" [disabled]="taskForm.invalid">Submit</button> 
        </mat-dialog-actions>
    </form>
  `,
  styles: `
    mat-dialog-content {
        overflow: hidden !important;
        max-height: none !important; 
    }
  `
})
export class TaskForm implements OnInit {

  private _task: taskViewInterface | undefined;
  
  @Input() 
  set task(taskData: taskViewInterface | undefined) {
    this._task = taskData;
    this.patchForm();
  }
  get task(): taskViewInterface | undefined {
    return this._task;
  }

  @Output() 
  public taskSubmitted: EventEmitter<taskInterface> = new EventEmitter();

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
      id:[null],
      title:["", [Validators.required, Validators.maxLength(50)]],
      note:["",Validators.maxLength(255)],
      cat_id:[1,Validators.required],
      prio:[null, Validators.min(0)],
      threat_id:[1, Validators.required],
      stat_id: [{ value: 1, disabled: true }, Validators.required],
      created_at:[new Date(),Validators.required],
      last_edited:[new Date(),Validators.required],
      deadline:[null],
      owner_id:[1]
    });
  }

  public patchForm(): void {
    if (this.task && this.taskForm) {
      this.taskForm.get('stat_id')?.enable();
      this.taskForm.patchValue({
        id:this.task.ID,
        title: this.task.Title,
        note: this.task.Description,
        cat_id:this.task.CID,
        prio:this.task.Priority,
        threat_id:this.task.TID,
        stat_id:this.task.SID,
        deadline:this.task.Deadline,
        owner_id:this.task.UID
      });
        this.taskForm.markAsPristine();
        this.taskForm.markAsUntouched();
        this.taskForm.updateValueAndValidity();
    } else if (this.taskForm) {
        this.resetForm();
    }
  }

  public onSubmit(): void {
    if (this.taskForm.valid) {
        this.snackBar.open('Task submitted successfully!', 'Dismiss', {
            duration: 3000,
            verticalPosition: 'top'
        });
        this.taskSubmitted.emit(this.taskForm.value);
        this.resetForm();
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

  private resetForm() {
      this.taskForm.reset({
          id:null,
          title: "",
          note: "",
          cat_id: 1,
          prio: null,
          threat_id: 1,
          stat_id: { value: 1, disabled: true },
          created_at: new Date(),
          last_edited: new Date(),
          deadline: null,
          owner_id: 1
      });
      this.taskForm.markAsPristine();
      this.taskForm.markAsUntouched();
      this.taskForm.updateValueAndValidity();
  }
}
