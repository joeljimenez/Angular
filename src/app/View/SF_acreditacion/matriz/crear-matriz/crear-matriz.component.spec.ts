import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearMatrizComponent } from './crear-matriz.component';

describe('CrearMatrizComponent', () => {
  let component: CrearMatrizComponent;
  let fixture: ComponentFixture<CrearMatrizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearMatrizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearMatrizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
