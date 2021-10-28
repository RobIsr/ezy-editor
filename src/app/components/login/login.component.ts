import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    form:FormGroup;
    error:string = "";
    email:string = "";
    password:string = "";

    constructor(
      private fb:FormBuilder, 
      private authService: AuthService,
      private router: Router
      ) {

      this.form = this.fb.group({
          email: ['',Validators.required],
          password: ['',Validators.required]
      });

      this.form.get("email")?.valueChanges.subscribe(emailValue => {
          this.email = emailValue;
        });

      this.form.get("password")?.valueChanges.subscribe(passwordValue => {
             this.password = passwordValue;
        });
    }

    login() {
        this.error = "";
        if (this.email != "" && this.password != "") {
          this.authService.login(this.email, this.password).subscribe((res) => {
            localStorage.setItem('JWT_TOKEN', JSON.stringify(res));
              this.router.navigate(['/'])
              .then(() => {
                  window.location.reload();
              });
          },
          (error) => {
              this.error = error.error.data;
          });
      } else {
        this.error = "Please provide both email and password."
      }
    }
}
