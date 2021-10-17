import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      console.log("Url: ", route.params.externalUrl);
      window.open(route.params.externalUrl);
      return false;

  }
}