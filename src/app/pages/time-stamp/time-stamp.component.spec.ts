import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeStampComponent } from './time-stamp.component';

describe('TimeStampComponent', () => {
  let component: TimeStampComponent;
  let fixture: ComponentFixture<TimeStampComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeStampComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeStampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
