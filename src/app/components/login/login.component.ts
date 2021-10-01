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

    constructor(
      private fb:FormBuilder, 
      private authService: AuthService,
      private router: Router
      ) {

      this.form = this.fb.group({
          email: ['',Validators.required],
          password: ['',Validators.required]
      });

      if(authService.userValue) {
        router.navigate(['/editor']);
      }
    }

    login() {
        const val = this.form.value;

        if (val.email && val.password) {
            this.authService.login(val.email, val.password);
        }
    }
}
