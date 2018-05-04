import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosSolicitudTesisComponent } from './datos-solicitud-tesis.component';

describe('DatosSolicitudTesisComponent', () => {
  let component: DatosSolicitudTesisComponent;
  let fixture: ComponentFixture<DatosSolicitudTesisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosSolicitudTesisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosSolicitudTesisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
