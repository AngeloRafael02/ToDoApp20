import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { merge } from 'rxjs';

import { Modal } from '../modal/modal';

@Component({
  selector: 'app-auth',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule, 
    MatIconModule,
    FormsModule, 
    ReactiveFormsModule,
    Modal
  ],
  template: `
  <div class="button-group">
    @if (!isAuth) {
      <button mat-flat-button color="primary" (click)="openAuth('login')">Log-In</button>
      <button mat-flat-button color="primary" (click)="openAuth('signup')">Register</button>
    } @else {
      <button mat-button (click)="isAuth = false">Logout</button>
    }
  </div>

  <modal [visible]="showModal" [title]="view === 'login' ? 'Welcome Back' : 'Create Account'" (close)="showModal = false" >
    <div class="auth-container">
      @if (view === 'login') {
        <p>Log in to manage your tasks.</p>
      } @else {
        <p>Join us to start organizing your projects.</p>

        <div class="name-row">
        <mat-form-field appearance="outline">
          <mat-label>First Name</mat-label>
          <input matInput [formControl]="firstName" required />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Last Name</mat-label>
          <input matInput [formControl]="lastName" required />
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Middle Name (Optional)</mat-label>
        <input matInput [formControl]="middleName" />
      </mat-form-field>
      }

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Email</mat-label>
        <input matInput placeholder="pat@example.com" [formControl]="email" (blur)="updateErrorMessage()" required/>
        @if (email.invalid) {
          <mat-error>{{errorMessage()}}</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Password</mat-label>
        <input matInput [type]="hide() ? 'password' : 'text'" />
        <button
          mat-icon-button
          matSuffix
          (click)="clickEvent($event)"
          type="button"
        >
          <mat-icon>{{hide() ? 'visibility_off' : 'visibility'}}</mat-icon>
        </button>
      </mat-form-field>

      @if (view === 'signup') {
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Confirm Password</mat-label>
          <input matInput [type]="hide() ? 'password' : 'text'" />
        </mat-form-field>
      }

      <div class="actions">
        <button mat-flat-button color="primary" class="full-width">
          {{ view === 'login' ? 'Login' : 'Sign Up' }}
        </button>
        
        <button mat-button type="button" class="full-width toggle-btn" (click)="toggleView()">
          {{ view === 'login' ? "Don't have an account? Register" : "Already have an account? Login" }}
        </button>
      </div>
    </div>
  </modal>
  `,
  styles: `
    .auth-container { 
      display: flex; 
      flex-direction: column; 
      gap: 8px; 
      padding-top: 10px; 
    }
    .full-width { 
      width: 100%; 
    }
    .actions { 
      margin-top: 16px; 
      display: flex; 
      flex-direction: column; 
      gap: 8px; 
    }
    .toggle-btn { 
      font-size: 0.85rem; 
      color: #666; 
    }
    .name-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      width: 100%;
    }
    .button-group {
      display: flex; 
      flex-direction: row; 
      gap: 8px; 
    }
  `,
})
export class Auth {
  public view : 'login' | 'signup' = 'login';
  public isAuth: boolean = false;
  public showModal: boolean = false;

  public readonly firstName = new FormControl('', [Validators.required]);
  public readonly middleName = new FormControl('');
  public readonly lastName = new FormControl('', [Validators.required]);
  public readonly email = new FormControl('', [Validators.required, Validators.email]);

  public errorMessage = signal('');
  public hide = signal(true);
  public nameErrorMessage = signal('');

  constructor() {
    merge(
      this.email.statusChanges, 
      this.email.valueChanges,
      this.firstName.statusChanges,
      this.lastName.statusChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  public openAuth(mode: 'login' | 'signup') {
    this.view = mode;
    this.showModal = true;
  }

  public toggleView() {
    this.view = this.view === 'login' ? 'signup' : 'login';
  }

  public updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }

    if (this.firstName.hasError('required') || this.lastName.hasError('required')) {
      this.nameErrorMessage.set('Name is required');
    } else {
      this.nameErrorMessage.set('');
    }
  }

  public clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}