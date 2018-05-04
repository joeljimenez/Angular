import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministradorPiezasComponent } from './administrador-piezas.component';

describe('AdministradorPiezasComponent', () => {
  let component: AdministradorPiezasComponent;
  let fixture: ComponentFixture<AdministradorPiezasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministradorPiezasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministradorPiezasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
