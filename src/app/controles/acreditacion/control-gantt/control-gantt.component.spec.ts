import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlGanttComponent } from './control-gantt.component';

describe('ControlGanttComponent', () => {
  let component: ControlGanttComponent;
  let fixture: ComponentFixture<ControlGanttComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlGanttComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlGanttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
