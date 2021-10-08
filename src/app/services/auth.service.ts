import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Token } from '../models/token.model';
import { User } from '../models/user';

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

    public get userToken():Token {
        return this.userSubject.value;
    }

    public getUser() {
        return this.getDecodedJwtToken(this.userToken.accessToken);
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

    getDecodedJwtToken(token: string):User  {
        try{
            return jwt_decode(token);
        }
        catch(error){
            return {} as User;
        }
      }
}

