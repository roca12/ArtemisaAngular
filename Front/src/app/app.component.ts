import { Component, HostBinding } from "@angular/core";
import { FormControl } from "@angular/forms";
import { OverlayContainer } from "@angular/cdk/overlay";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "app";

  constructor(private overlay: OverlayContainer) {}
  ngOnInit(): void {}
}
