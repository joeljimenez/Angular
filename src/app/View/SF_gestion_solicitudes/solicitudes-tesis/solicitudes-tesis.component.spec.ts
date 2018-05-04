import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesTesisComponent } from './solicitudes-tesis.component';

describe('SolicitudesTesisComponent', () => {
  let component: SolicitudesTesisComponent;
  let fixture: ComponentFixture<SolicitudesTesisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudesTesisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesTesisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
