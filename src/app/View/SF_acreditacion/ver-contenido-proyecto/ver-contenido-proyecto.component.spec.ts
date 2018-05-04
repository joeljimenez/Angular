import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerContenidoProyectoComponent } from './ver-contenido-proyecto.component';

describe('VerContenidoProyectoComponent', () => {
  let component: VerContenidoProyectoComponent;
  let fixture: ComponentFixture<VerContenidoProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerContenidoProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerContenidoProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
