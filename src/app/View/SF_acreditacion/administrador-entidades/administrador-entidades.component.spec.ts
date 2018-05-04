import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministradorEntidadesComponent } from './administrador-entidades.component';

describe('AdministradorEntidadesComponent', () => {
  let component: AdministradorEntidadesComponent;
  let fixture: ComponentFixture<AdministradorEntidadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministradorEntidadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministradorEntidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
