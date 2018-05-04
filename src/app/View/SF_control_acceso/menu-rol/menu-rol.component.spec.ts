import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuRolComponent } from './menu-rol.component';

describe('MenuRolComponent', () => {
  let component: MenuRolComponent;
  let fixture: ComponentFixture<MenuRolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuRolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
