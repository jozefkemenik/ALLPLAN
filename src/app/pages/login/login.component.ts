import { Component, Injectable, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../core/guards/auth.service';
import { UntypedFormGroup, UntypedFormControl, Validators, AbstractControl } from '@angular/forms';
import { Router, } from '@angular/router';
import { TranslationService } from '../../core/services//translation.service';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/core/services/http.service';

@Injectable()
@Component({
  selector: 'ap-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  hide = true;
  rememberme = false;
  showError = false
  loading = false;
  submitted = false;
  checkedRememberme: boolean;
  form = new UntypedFormGroup({
    username: new UntypedFormControl('', {
      validators: [Validators.required, Validators.email],
      updateOn: 'submit',
    }),
    password: new UntypedFormControl('', {
      validators: [Validators.required],
      updateOn: 'submit',
    }),
    rememberme: new UntypedFormControl()
  });

  constructor(private authService: AuthService, private router: Router, private httpService: HttpService, private ts: TranslationService) { }

  ngOnInit(): void {
    this.checkedRememberme = this.authService.rememberMe;
    const email = this.httpService.getParameterByName('email');
    if (email) this.form.controls.username.setValue(email);


    const redirectTo = this.httpService.getParameterByName('redirectTo');
    if (redirectTo) {
      var urlArr = redirectTo.split('?');
      if (urlArr.length > 1) {
        var queryJson = this.httpService.makeJsonFromQuey(urlArr[1])
        if (queryJson && queryJson['email']) this.form.controls.username.setValue(queryJson['email']);
      }
    }

    //todo, no idea what should remember me do 

    // if (this.checkedRememberme) {
    //     if (redirectTo) {
    //       var urlArr = redirectTo.split('?');
    //       this.router.navigate([urlArr[0]], { queryParams: this.httpService.makeJsonFromQuey(urlArr[1]) });
    //     } else {
    //       this.router.navigate(['/']);
    //     }
    //   }
  }

  get username() { return this.form.get('username')?.value; }
  get password() { return this.form.get('password')?.value; }

  /** call login */
  public submit(): void {
    this.showError = false
    this.authService.rememberMe = this.checkedRememberme;
    this.submitted = true;
    const redirectTo = this.httpService.getParameterByName('redirectTo');
    if (this.form.valid) {
      this.loading = true;
      this.authService.login(this.username, this.password).then(
        resn => {
          if (redirectTo) {
            var urlArr = redirectTo.split('?');
            this.router.navigate([urlArr[0]], { queryParams: this.httpService.makeJsonFromQuey(urlArr[1]) });
          } else {
            this.router.navigate(['/']);
          }
        }
        , err => {
          this.showError = true;
        }).finally(() => {
          this.loading = false;
        });

    }
  }

  get linkRegister(): string {
    return `${environment.registerUrl}?L=${this.ts.language.linkId}`;
  }
  get linkForgetPwd(): string {
    return `${environment.forgetPwdUrl}?L=${this.ts.language.linkId}`;
  }
}
