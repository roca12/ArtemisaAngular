import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Error521Component } from "./error521.component";

describe("Error521Component", () => {
  let component: Error521Component;
  let fixture: ComponentFixture<Error521Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Error521Component],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Error521Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
