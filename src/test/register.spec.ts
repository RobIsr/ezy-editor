import { InputModalityDetector } from '@angular/cdk/a11y';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RegisterComponent } from 'src/app/components/register/register.component';
import { AuthService } from 'src/app/services/auth.service';

class MockAuthService {
  register() {
    return false;
  }
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeAll(() => {
    window.onbeforeunload = () => 'Oh no!';
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    component.success = "";
    component.error = "";
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should display correct labels and button text.', () => {
    const statusElement: HTMLElement = fixture.nativeElement;
    const labels = statusElement.querySelectorAll('label') as NodeList;
    const loginBtn: HTMLButtonElement = statusElement.querySelector('#register-btn') as HTMLButtonElement;

    // Check that form labels and login button is displayed.
    expect(labels.length).toEqual(2);
    expect(labels[0].textContent).toEqual("Email:");
    expect(labels[1].textContent).toEqual("Password:");
    expect(loginBtn.textContent).toEqual("Register");
  });

  it('should have error status when error is set."', () => {
    const statusElement: HTMLElement = fixture.nativeElement;
    const registerBtn: HTMLButtonElement = statusElement.querySelector('#register-btn') as HTMLButtonElement;

    expect(fixture.debugElement.query(By.css('#sucess'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#error'))).toBeNull();

    registerBtn.click();

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#error'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('#sucess'))).toBeNull();
  });

  it('should have succes status when success is set."', () => {
    const statusElement: HTMLElement = fixture.nativeElement;

    expect(fixture.debugElement.query(By.css('#sucess'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#error'))).toBeNull();

    // Set error content and confirm error div is displayed.
    component.success = "sucess";

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#success'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('#error'))).toBeNull();
  });
});