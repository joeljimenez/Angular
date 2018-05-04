import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioEvaluacionesComponent } from './formulario-evaluaciones.component';

describe('FormularioEvaluacionesComponent', () => {
  let component: FormularioEvaluacionesComponent;
  let fixture: ComponentFixture<FormularioEvaluacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioEvaluacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioEvaluacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
