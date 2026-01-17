import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorConfig } from './color-config';

describe('ColorConfig', () => {
  let component: ColorConfig;
  let fixture: ComponentFixture<ColorConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
