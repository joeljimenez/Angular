import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorEvaluadoresRrhhComponent } from './gestor-evaluadores-rrhh.component';

describe('GestorEvaluadoresRrhhComponent', () => {
  let component: GestorEvaluadoresRrhhComponent;
  let fixture: ComponentFixture<GestorEvaluadoresRrhhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestorEvaluadoresRrhhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestorEvaluadoresRrhhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
