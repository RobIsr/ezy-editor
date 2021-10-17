import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RedirectGuard } from './redirect-guard';
import { AuthGuardService } from './services/auth-guard.service';

//Define routes
const routes: Routes = [
  { path: '', component: LayoutComponent },
  { path: 'editor', component: AppComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'externalRedirect',
    canActivate: [RedirectGuard],
    component: RedirectGuard
  }
]; 

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }