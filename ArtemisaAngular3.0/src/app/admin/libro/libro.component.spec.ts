import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroComponent } from './libro.component';

describe('LibroComponent', () => {
  let component: LibroComponent;
  let fixture: ComponentFixture<LibroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
