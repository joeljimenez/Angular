import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkinPinnerComponent } from './skin-pinner.component';

describe('SkinPinnerComponent', () => {
  let component: SkinPinnerComponent;
  let fixture: ComponentFixture<SkinPinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkinPinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkinPinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
