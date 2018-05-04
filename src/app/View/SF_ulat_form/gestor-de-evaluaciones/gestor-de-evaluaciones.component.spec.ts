import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorDeEvaluacionesComponent } from './gestor-de-evaluaciones.component';

describe('GestorDeEvaluacionesComponent', () => {
  let component: GestorDeEvaluacionesComponent;
  let fixture: ComponentFixture<GestorDeEvaluacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestorDeEvaluacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestorDeEvaluacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
