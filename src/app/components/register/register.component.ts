import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'register',
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    form:FormGroup;
    error:string = "";
    success:string = "";

    constructor(private fb:FormBuilder, 
                 private authService: AuthService) {

        this.form = this.fb.group({
            email: ['',Validators.required],
            password: ['',Validators.required]
        });
    }

    register() {
        const val = this.form.value;

        if (val.email && val.password) {
                this.authService.register(val.email, val.password).subscribe((res:any) => {
                    this.success = res.data;
                },
                (error) => {
                  if (error.status == 409) {
                      this.error = error.error.data;
                  }
                });;
        } else {
            this.error = "Please provide email and password.";
        }
    }
}
