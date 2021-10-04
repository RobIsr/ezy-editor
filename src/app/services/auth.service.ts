import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Token } from '../models/token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    public jwt_token:object | undefined;

    private userSubject: BehaviorSubject<any>;
    public user: Observable<any>;

    public notifyOther(data: any) {
        if (data) {
            this.userSubject.next(data);
        }
    }

    constructor( private http: HttpClient, private router: Router, ) {
        this.userSubject = new BehaviorSubject<Token>(JSON.parse(localStorage.getItem('JWT_TOKEN') as string));
        this.user = this.userSubject.asObservable();
    }

    loginUrl = `${environment.apiUrl}/login`;
    registerUrl = `${environment.apiUrl}/register`;

    public get userValue():Token {
        return this.userSubject.value;
    }

    /**
     * Registers new user.
     * @param username Entered username
     * @param password Entered password
     */
    register(username:string, password:string) {
        return this.http.put(this.registerUrl, {
            "username": username,
            "password": password
          });
    }
    
    /**
     * Logs user in and notifies subscribed components.
     * @param username Entered username
     * @param password Entered password
     */
    login(username:string, password:string) {
        return this.http.post(`${environment.apiUrl}/login`, { username, password });
    }

    logout() {
        localStorage.removeItem('JWT_TOKEN');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }
}
