import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { Modal } from '../modal/modal';


@Component({
  selector: 'task-form',
  imports: [
    MatButtonModule,
    Modal
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss'
})
export class TaskForm {
  isModalOpen: boolean = false;
}
