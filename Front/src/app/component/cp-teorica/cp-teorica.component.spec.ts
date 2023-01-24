import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTeoricaComponent } from './cp-teorica.component';

describe('CpTeoricaComponent', () => {
  let component: CpTeoricaComponent;
  let fixture: ComponentFixture<CpTeoricaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpTeoricaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTeoricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
