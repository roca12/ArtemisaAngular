/**
 * Angular core and form handling imports
 */
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

/**
 * UI blocking functionality for loading states
 */
import {BlockUI, NgBlockUI} from "ng-block-ui";

/**
 * Environment configuration for API endpoints
 */
import {environment} from "../../../environments/environment";

/**
 * Login component decorator
 * Defines the component's selector, template, and styles
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
/**
 * Login component class
 * Handles user authentication functionality
 */
export class LoginComponent implements OnInit {
  /**
   * Form group for login credentials
   * Contains username and password fields with validation
   */
  formGroupLogin: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.required]),
    password: new FormControl(''),
  });

  /**
   * BlockUI decorator for showing loading indicator
   * Used during API calls to prevent user interaction
   */
  @BlockUI() blockUI: NgBlockUI;

  /**
   * Constructor for the LoginComponent
   * @param http - HttpClient for making API requests
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Angular lifecycle hook that is called after component initialization
   * Currently empty but can be used for initialization logic
   */
  ngOnInit(): void {
  }

  /**
   * Handles form submission for user login
   * Sends credentials to the authentication API and processes the response
   */
  submitForm() {
    // Create user object from form values
    const user = {
      user: this.formGroupLogin.controls['username'].value,
      password: this.formGroupLogin.controls['password'].value,
    }

    // Show loading indicator
    this.blockUI.start();

    // Send authentication request to API
    this.http.post(`${environment.artemisaExpress}/api/usuario/autenticar`, user).toPromise()
      .then((response: any) => {
        // Handle empty response
        if (!Object.keys(response).length) {
          this.blockUI.stop();
          return;
        }

        // Store authentication token and refresh page
        localStorage.setItem('token', response.token);
        this.blockUI.stop();
        window.location.reload();
      })
      .catch((e) => {
        // Log errors to console
        console.log('[ERROR]');
        console.log(e)
      });
  }
}
