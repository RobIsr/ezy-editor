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

    constructor(
      private fb:FormBuilder, 
      private authService: AuthService,
      private router: Router
      ) {

      this.form = this.fb.group({
          email: ['',Validators.required],
          password: ['',Validators.required]
      });
    }

    login() {
        const val = this.form.value;

        this.error = "";

        if (val.email && val.password) {
          this.error = "";
            this.authService.login(val.email, val.password).subscribe((res) => {
              localStorage.setItem('JWT_TOKEN', JSON.stringify(res));
                this.router.navigate(['/'])
                .then(() => {
                    window.location.reload();
                });
            },
            (error) => {
                this.error = error.error.data;
            });
        }
    }
}
