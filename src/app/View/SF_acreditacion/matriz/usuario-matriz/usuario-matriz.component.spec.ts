import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioMatrizComponent } from './usuario-matriz.component';

describe('UsuarioMatrizComponent', () => {
  let component: UsuarioMatrizComponent;
  let fixture: ComponentFixture<UsuarioMatrizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioMatrizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioMatrizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
