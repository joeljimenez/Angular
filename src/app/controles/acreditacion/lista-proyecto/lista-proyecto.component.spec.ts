import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaProyectoComponent } from './lista-proyecto.component';

describe('ListaProyectoComponent', () => {
  let component: ListaProyectoComponent;
  let fixture: ComponentFixture<ListaProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
