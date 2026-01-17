import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorConfigTable } from './color-config-table';

describe('ColorConfigTable', () => {
  let component: ColorConfigTable;
  let fixture: ComponentFixture<ColorConfigTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorConfigTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorConfigTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
