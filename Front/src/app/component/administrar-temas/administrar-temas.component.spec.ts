import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarTemasComponent } from './administrar-temas.component';

describe('AdministrarTemasComponent', () => {
  let component: AdministrarTemasComponent;
  let fixture: ComponentFixture<AdministrarTemasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrarTemasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrarTemasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
