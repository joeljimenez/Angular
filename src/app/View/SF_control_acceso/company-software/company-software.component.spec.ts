import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySoftwareComponent } from './company-software.component';

describe('CompanySoftwareComponent', () => {
  let component: CompanySoftwareComponent;
  let fixture: ComponentFixture<CompanySoftwareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanySoftwareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
