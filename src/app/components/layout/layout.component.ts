import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  templateUrl: 'layout.component.html',
  selector: 'app-root',
})
export class LayoutComponent {
    constructor(
        private router: Router,
        private accountService: AuthService
    ) {
        // redirect to home if already logged in
        if (this.accountService.userValue) {
            this.router.navigate(['/editor']);
        } else {
          this.router.navigate(['/login']);
        }
    }
}