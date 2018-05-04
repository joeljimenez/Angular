import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCarpetasComponent } from './control-carpetas.component';

describe('ControlCarpetasComponent', () => {
  let component: ControlCarpetasComponent;
  let fixture: ComponentFixture<ControlCarpetasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlCarpetasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCarpetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
