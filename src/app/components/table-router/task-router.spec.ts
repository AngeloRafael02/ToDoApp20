import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskRouter } from './task-router';

describe('TaskRouter', () => {
  let component: TaskRouter;
  let fixture: ComponentFixture<TaskRouter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskRouter]
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
