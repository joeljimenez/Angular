import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudTesisProfComponent } from './solicitud-tesis-prof.component';

describe('SolicitudTesisProfComponent', () => {
  let component: SolicitudTesisProfComponent;
  let fixture: ComponentFixture<SolicitudTesisProfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudTesisProfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudTesisProfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
