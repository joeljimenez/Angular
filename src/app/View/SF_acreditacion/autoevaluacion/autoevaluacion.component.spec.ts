import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoevaluacionComponent } from './autoevaluacion.component';

describe('AutoevaluacionComponent', () => {
  let component: AutoevaluacionComponent;
  let fixture: ComponentFixture<AutoevaluacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoevaluacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoevaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
