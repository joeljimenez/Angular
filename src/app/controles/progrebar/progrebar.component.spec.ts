import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrebarComponent } from './progrebar.component';

describe('ProgrebarComponent', () => {
  let component: ProgrebarComponent;
  let fixture: ComponentFixture<ProgrebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgrebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
