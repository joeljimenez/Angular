import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlEvidenciaComponent } from './control-evidencia.component';

describe('ControlEvidenciaComponent', () => {
  let component: ControlEvidenciaComponent;
  let fixture: ComponentFixture<ControlEvidenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlEvidenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlEvidenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
