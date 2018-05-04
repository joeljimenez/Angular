import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulariosPreguntasComponent } from './formularios-preguntas.component';

describe('FormulariosPreguntasComponent', () => {
  let component: FormulariosPreguntasComponent;
  let fixture: ComponentFixture<FormulariosPreguntasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulariosPreguntasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulariosPreguntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
