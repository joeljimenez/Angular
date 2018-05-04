import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNodoComponent } from './form-nodo.component';

describe('FormNodoComponent', () => {
  let component: FormNodoComponent;
  let fixture: ComponentFixture<FormNodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormNodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormNodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
