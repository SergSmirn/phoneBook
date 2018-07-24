import { Component, OnInit } from '@angular/core';
import { AuthService } from "./auth.service";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreService } from '../core/core.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private coreService: CoreService, private router: Router) { }

  form: FormGroup;

  is_submted = false;
  is_error = false;

  ngOnInit() {

    if (this.authService.getToken()) {
      this.router.navigate(['']);
    }

    this.form = new FormGroup({
      username: new FormControl('',
        [Validators.required,
        Validators.maxLength(100)]),
      password: new FormControl('', [
        Validators.required
      ]),
    });
  }

  onSubmit() {
    this.form.controls.username.markAsTouched();
    this.form.controls.password.markAsTouched();

    this.is_submted = true;
    if (this.form.valid) {

      const username = this.form.controls.username.value;
      const password = this.form.controls.password.value;

      this.authService.login(username, password).subscribe((response: Response) => {
        let token = response && response['token'];
        if (token) {
          this.authService.setToken(token);
          localStorage.setItem('id_token', token);
          this.router.navigate(['']);
          this.coreService.page = 0;
          this.coreService.listItems(0);
        }
      }, error => { 
        console.error(error);
        this.is_error = true;
       });
      this.form.reset();
    }
  }

  getErrors(errors: any) {
    return this.authService.getErrors(errors);
  }

  getValidation(error: string) {
    return this.form.get(error).invalid && (this.form.get(error).touched || this.is_submted) || this.is_error;
  }
}
