import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMailComponent } from './modal-mail.component';

describe('ModalMailComponent', () => {
  let component: ModalMailComponent;
  let fixture: ComponentFixture<ModalMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalMailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
