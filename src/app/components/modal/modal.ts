import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-modal',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
  @if(visible){
    <div class="modal-backdrop" (click)="onClose()">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <button 
        mat-icon-button 
        class="modal-close-button" 
        (click)="onClose()" 
        aria-label="Close modal"
      >
        <mat-icon>close</mat-icon>
      </button>
      
      <div class="modal-body">
        <ng-content></ng-content>
      </div>
    </div>
  </div>
  }
  `,
  styles: `
    .modal-backdrop {
        /* Full screen overlay */
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000; /* Ensure it is above other content */
    }

    .modal-content {
        background-color: white;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        position: relative; /* For positioning the close button */
        min-width: 300px;
        max-width: 80%;
    }

    .modal-close-button {
        position: absolute;
        top: 8px;
        right: 8px;
    }

    .modal-body {
        /* Keep padding/margins for the projected content */
        padding-top: 16px; 
    }
  `
})
export class Modal {
  // Input to control visibility from the parent component
  @Input() visible: boolean = false;

  // Output to notify the parent when the user requests to close the modal
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    // Emit an event to the parent component
    this.close.emit();
  }
}


/**NOTE - How to use this Component:
    <button mat-raised-button color="primary" (click)="isModalVisible = true">
      Open Modal
    </button>

    <app-modal 
      [visible]="isModalVisible" 
      (close)="isModalVisible = false"
    >
      <h3>🥳 Success!</h3>
      <p>This is **Modal Content** with a custom header and text.</p>
      <button mat-button (click)="isModalVisible = false">Close from inside</button>
    </app-modal>
*/