import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TaskTable } from './task-table';

describe('TaskTable', () => {
  let component: TaskTable;
  let fixture: ComponentFixture<TaskTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskTable],
      providers: [
        provideZonelessChangeDetection()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
