import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {BlockUI, NgBlockUI} from "ng-block-ui";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formGroupLogin: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.required]),
    password: new FormControl(''),
  });

  constructor(private http: HttpClient) {
  }

  @BlockUI() blockUI: NgBlockUI;

  ngOnInit(): void {
  }

  submitForm() {
    const user = {
      user: this.formGroupLogin.controls['username'].value,
      password: this.formGroupLogin.controls['password'].value,
    }
    this.blockUI.start();
    this.http.post(`${environment.artemisaExpress}/api/usuario/autenticar`, user).toPromise()
      .then((response: any) => {
        if (!Object.keys(response).length) {
          this.blockUI.stop();
          return;
        }
        localStorage.setItem('token', response.token);
        this.blockUI.stop();
        window.location.reload();
      })
      .catch((e) => {
        console.log('[ERROR]');
        console.log(e)
      });
  }
}
