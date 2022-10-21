import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Error418Component } from './error418.component';

describe('Error418Component', () => {
  let component: Error418Component;
  let fixture: ComponentFixture<Error418Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Error418Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Error418Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
