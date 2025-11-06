import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';

import { Modal } from '../modal/modal';
import { categoriesInterface, conditionInterface, threatInterface } from '../../interfaces/forms.interface';


@Component({
  selector: 'task-form',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatGridListModule,
    Modal
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss'
})
export class TaskForm {
  public isModalOpen: boolean = false;
  public taskCategories: categoriesInterface[] = [];
  public taskConditions: conditionInterface[] = [];
  public taskThreatLevels: threatInterface[] = [];
}
