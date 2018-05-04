import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNodoProyectoComponent } from './form-nodo-proyecto.component';

describe('FormNodoProyectoComponent', () => {
  let component: FormNodoProyectoComponent;
  let fixture: ComponentFixture<FormNodoProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormNodoProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormNodoProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
