import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulariosPeriodosComponent } from './formularios-periodos.component';

describe('FormulariosPeriodosComponent', () => {
  let component: FormulariosPeriodosComponent;
  let fixture: ComponentFixture<FormulariosPeriodosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulariosPeriodosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulariosPeriodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
