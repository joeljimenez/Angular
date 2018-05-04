import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestasEmpleadoComponent } from './encuestas-empleado.component';

describe('EncuestasEmpleadoComponent', () => {
  let component: EncuestasEmpleadoComponent;
  let fixture: ComponentFixture<EncuestasEmpleadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncuestasEmpleadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncuestasEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
