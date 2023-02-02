import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTemarioComponent } from './dialog-temario.component';

describe('DialogTemarioComponent', () => {
  let component: DialogTemarioComponent;
  let fixture: ComponentFixture<DialogTemarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogTemarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTemarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
