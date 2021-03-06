import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SedesComponent } from './sedes.component';

describe('SedesComponent', () => {
  let component: SedesComponent;
  let fixture: ComponentFixture<SedesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SedesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SedesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
