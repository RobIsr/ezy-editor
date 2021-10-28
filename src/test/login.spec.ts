import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoginComponent } from 'src/app/components/login/login.component';
import { AuthService } from 'src/app/services/auth.service';

class MockAuthService {
  register() {
    return false;
  }
  login(username:string, password:string) {
      if (username && password) {
          return Promise.resolve("JWT_TOKEN");
      } else {
        return Promise.reject("error");
      }
  }
}


let mockRouter = {
    navigate: () => {return true}
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.error = "";
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have error status when error is set."', () => {
    const statusElement: HTMLElement = fixture.nativeElement;
    const labels = statusElement.querySelectorAll('label') as NodeList;
    const registerBtn: HTMLButtonElement = statusElement.querySelector('#login-btn') as HTMLButtonElement;

    // Confirm no error message
    expect(fixture.debugElement.query(By.css('#login-error'))).toBeNull();

    // Set error content and confirm error div is displayed.
    component.error = "error";

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#login-error'))).not.toBeNull();
  });

  it('should display correct labels and button text.', () => {
    const statusElement: HTMLElement = fixture.nativeElement;
    const labels = statusElement.querySelectorAll('label') as NodeList;
    const loginBtn: HTMLButtonElement = statusElement.querySelector('#login-btn') as HTMLButtonElement;

    // Check that form labels and login button is displayed.
    expect(labels.length).toEqual(2);
    expect(labels[0].textContent).toEqual("Email:");
    expect(labels[1].textContent).toEqual("Password:");
    expect(loginBtn.textContent).toEqual("Login");
  });

  it('should display error message when login is clicked with unfilled form."', () => {
    const statusElement: HTMLElement = fixture.nativeElement;
    const loginBtn: HTMLButtonElement = statusElement.querySelector('#login-btn') as HTMLButtonElement;

    // Confirm no error message.
    expect(fixture.debugElement.query(By.css('#login-error'))).toBeNull();

    // Set error content and confirm error div is displayed.
    loginBtn.click();
    
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#login-error'))).not.toBeNull();
  });

  it('should call login method when login button is clicked', () => {
    let spy = spyOn(component, "login");
    let routerSpy = spyOn(mockRouter, "navigate");
    const statusElement: HTMLElement = fixture.nativeElement;
    const labels = statusElement.querySelectorAll('label') as NodeList;
    const loginBtn: HTMLButtonElement = statusElement.querySelector('#login-btn') as HTMLButtonElement;

    expect(fixture.debugElement.query(By.css('#login-error'))).toBeNull();

    component.email = "test@test.com";
    component.password = "test";

    fixture.detectChanges();
    // Set error content and confirm error div is displayed.
    loginBtn.click();
    fixture.detectChanges();

    // Check that components login method gets called and that no error messages appear
    expect(fixture.debugElement.query(By.css('#login-error'))).toBeNull();
    expect(spy).toHaveBeenCalled();
  });
});