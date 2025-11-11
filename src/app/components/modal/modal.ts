import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogModule,MatDialog, MatDialogRef } from '@angular/material/dialog';
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
    <ng-template> 
      <h2 mat-dialog-title>
        {{ title }}
        
        <button mat-icon-button mat-dialog-close style="position: absolute; top: 12px; right: 8px;" aria-label="Close dialog">
          <mat-icon>close</mat-icon>
        </button>
      </h2>
  
      <mat-dialog-content>
        <ng-content></ng-content>
      </mat-dialog-content>
  
      <mat-dialog-actions align="end">
      </mat-dialog-actions>
    </ng-template>
  `,
  styles: ``,
})
export class Modal implements OnChanges {
  @ViewChild(TemplateRef, { static: true }) dialogTemplate!: TemplateRef<any>;

  @Input() title: string = '';
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<any>();

  private dialogRef!: MatDialogRef<any> | null;

  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      if (this.visible && !this.dialogRef) {
        this.openModal();
      } else if (!this.visible && this.dialogRef) {
        this.dialogRef.close();
      }
    }
  }

  openModal(): void {
    this.dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '400px',
      disableClose: false,
      hasBackdrop: true,
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
      this.close.emit(result);
    });
  }
}


/**NOTE - How to use this Component:
  <button mat-raised-button color="primary" (click)="isModalVisible = true">
    Open Material Dialog
  </button>

  <modal
    [visible]="isModalVisible"
    [title]="'Material Dialog Title'"
    (close)="isModalVisible = false"
  >
    <h3>🎉 Material Success!</h3>
    <p>This content is injected into the <mat-dialog-content> section.</p>
    <button mat-button mat-dialog-close>Close from inside</button>
  </modal>
*/