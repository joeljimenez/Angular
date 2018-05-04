import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministradorEsquemasComponent } from './administrador-esquemas.component';

describe('AdministradorEsquemasComponent', () => {
  let component: AdministradorEsquemasComponent;
  let fixture: ComponentFixture<AdministradorEsquemasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministradorEsquemasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministradorEsquemasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
