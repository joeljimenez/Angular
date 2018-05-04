import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEvidenciasComponent } from './crear-evidencias.component';

describe('CrearEvidenciasComponent', () => {
  let component: CrearEvidenciasComponent;
  let fixture: ComponentFixture<CrearEvidenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearEvidenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearEvidenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
