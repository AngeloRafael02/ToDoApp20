import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'modal',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
  @if(visible){
    <div class="modal-backdrop" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
      
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button mat-icon-button class="modal-close-button" (click)="onClose()" aria-label="Close modal">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        
        <div class="modal-body">
          <ng-content></ng-content>
        </div>

      </div>
    </div>
  }
  `,
  styles: `
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      .modal-content {
        background-color: white;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        position: relative;
        min-width: 300px;
        max-width: 80%;
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0;
          margin-bottom: 16px;
          .modal-title {
            margin: 0;
            font-size: 1.5em;
            font-weight: bold;
            margin-right: 8px; 
          }
          .modal-close-button {
            position: absolute; 
            top: 8px;
            right: 8px;
          }
        }
        .modal-body {
          padding-top: 16px; 
        }
      }
    }
  `
})
export class Modal {
  @Input() title: string = '';
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}


/**NOTE - How to use this Component:
    <button mat-raised-button color="primary" (click)="isModalVisible = true">
      Open Modal
    </button>

    <modal 
      [visible]="isModalVisible" 
      (close)="isModalVisible = false"
    >
      <h3>🥳 Success!</h3>
      <p>This is **Modal Content** with a custom header and text.</p>
      <button mat-button (click)="isModalVisible = false">Close from inside</button>
    </modal>
*/