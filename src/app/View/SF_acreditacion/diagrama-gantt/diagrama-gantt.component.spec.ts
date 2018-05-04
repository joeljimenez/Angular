import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramaGanttComponent } from './diagrama-gantt.component';

describe('DiagramaGanttComponent', () => {
  let component: DiagramaGanttComponent;
  let fixture: ComponentFixture<DiagramaGanttComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagramaGanttComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramaGanttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
