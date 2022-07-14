import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Error410Component } from './error410.component';

describe('Error410Component', () => {
  let component: Error410Component;
  let fixture: ComponentFixture<Error410Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Error410Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Error410Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
