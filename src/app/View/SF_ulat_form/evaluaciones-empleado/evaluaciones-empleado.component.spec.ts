import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionesEmpleadoComponent } from './evaluaciones-empleado.component';

describe('EvaluacionesEmpleadoComponent', () => {
  let component: EvaluacionesEmpleadoComponent;
  let fixture: ComponentFixture<EvaluacionesEmpleadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluacionesEmpleadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluacionesEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
