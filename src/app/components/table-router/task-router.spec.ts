import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TaskRouter } from './task-router';

describe('TaskRouter', () => {
  let component: TaskRouter;
  let fixture: ComponentFixture<TaskRouter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskRouter],
      providers: [
        provideZonelessChangeDetection()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskRouter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
