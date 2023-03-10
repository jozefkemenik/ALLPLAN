import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { IdynamicControl } from '@shared/models/IdynamicControl';
import { EcontrolType } from '@shared/models/EcontrolType.enum';
import { FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { HttpService } from 'src/app/core/services/http.service';
import { IframeDialogProvider, EIframeDialogType } from 'src/app/shared/dialogs/iframe-dialog/iframe-dialog';
import { TranslationService } from 'src/app/core/services/translation.service';
import { AuthService } from '../../core/guards/auth.service';
import { Router, } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';


@Component({
  selector: 'ap-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InvitationComponent implements OnInit, AfterViewInit {
  options: Array<IdynamicControl> = [];
  form: FormGroup;
  loading = false;
  submitted = false;
  data: any = {};

  passwordErrors: Array<string> = [];
  passwordRepeatErrors: Array<string> = [];
  queryUser: string;
  queryId: string;
  queryLang: string;


  @ViewChild('linkterm') linkterm: ElementRef;;

  constructor(private iframeDialog: IframeDialogProvider ,
    private http: HttpService,
    private renderer: Renderer2,
    private ts: TranslationService,
    private au: AuthService,
    private router: Router,
    private as:AlertService
  ) { }

  ngOnInit(): void {
    this.queryUser = this.http.getParameterByName('email');
    this.queryId = this.http.getParameterByName('id');
    this.queryLang = this.http.getParameterByName('l');
    this.initConfig();

    // we have to map click on the link when translation changes 
    this.ts.change$.subscribe(() => {
      setTimeout(() => {
        this.makeTermsOfUseLinkActive();
      }, 200);
    });

    this.checkRegistered();
  }

  ngAfterViewInit() {
    this.makeTermsOfUseLinkActive();
  }

  makeTermsOfUseLinkActive() {
    this.renderer.listen(this.linkterm.nativeElement.querySelector('a'), "click", () => { this.iframeDialog.open(EIframeDialogType.TermsOfUse); })
  }


  initConfig() {
    let controls: Array<IdynamicControl> = [
      {
        id: "email",
        key: 'email',
        label: 'email',
        type: EcontrolType.text,
        disabled: true,
        validators: [Validators.required,Validators.email]
      },
      // {
      //   id: "salutation",
      //   key: 'salutation',
      //   label: 'salutation',
      //   type: EcontrolType.dropDown,
      // },
      {
        id: "firstName",
        key: 'firstName',
        label: 'firstName',
        type: EcontrolType.text,
        validators: [Validators.required, Validators.minLength(2)]

      },
      {
        id: "lastName",
        key: 'lastName',
        label: 'lastName',
        type: EcontrolType.text,
        validators: [Validators.required, Validators.minLength(2)]

      },
      {
        id: "password",
        key: 'password',
        label: 'loginPagePassword',
        type: EcontrolType.password,
        validators: [this.validatePassword.bind(this)]
      },
      {
        id: "repeatPassword",
        key: 'repeatPassword',
        label: 'repeatPassword',
        type: EcontrolType.password,
        validators: [this.validateRepeatPassword.bind(this)]
      },
      {
        id: "termsOfUseAccepted",
        key: 'termsOfUseAccepted',
        label: 'termsOfUseText',
        type: EcontrolType.checkBox,
        validators: [Validators.requiredTrue],

      }];

    let formControls = {};
    controls.forEach((item) => {
      formControls[item.id] = new FormControl({ value: '', disabled: false }, item.validators ? item.validators : []);
    });
    this.form = new FormGroup(formControls);
    //trigger repeater in html
    this.options = controls;
    //set email from url
    this.form.controls.email.setValue(this.queryUser);
  }


  touchedControl(id) {
    return this.form.controls[id].touched;
  }

  invalidControl(id) {
    return this.form.controls[id].invalid;
  }

  validatePassword(control: AbstractControl): { [key: string]: any } | null {
    this.passwordErrors = [];
    if (!control.value || control.value.length < 8) {
      this.passwordErrors.push('error8Characters');
    }
    const reUpCase = /.*[A-Z].*/;
    if (!reUpCase.test(control.value)) {
      this.passwordErrors.push('errorUpperCase');
    }
    const reLoCase = /.*[a-z].*/;
    if (!reLoCase.test(control.value)) {
      this.passwordErrors.push('errorLowerCase');
    }
    const reNumber = /.*\d.*/;
    if (!reNumber.test(control.value)) {
      this.passwordErrors.push('errorNumber');
    }
    const reSpecial = /.*\W.*/;
    if (!reSpecial.test(control.value)) {
      this.passwordErrors.push('errorSpecial');
    }
    if (this.passwordErrors.length) {
      return { 'invalid': true };
    }
    this.form.controls.repeatPassword.updateValueAndValidity();
    return null;
  }

  validateRepeatPassword(control: AbstractControl): { [key: string]: any } | null {
    this.passwordRepeatErrors = [];
    if (this.form && (!control.value || this.form.controls.password.getRawValue() !== control.value)) {
      this.passwordRepeatErrors.push('errorPasswordMatch');
    }
    if (this.passwordRepeatErrors.length) {
      return { 'invalid': true };
    }
    return null;
  }

  checkRegistered(){
    this.loading = true;
    this.au.isRegistered(this.queryId).then((is)=>{
      if(is){
        this.as.info('confirmInvitation', 'confirmInvitationError', null, 10000);  
        this.as.keepAfterRouteChange=true;
        this.au.logout(this.queryUser);
      }
  }).finally(()=>{
    this.loading = false;
  })
    
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    let payLoad: any = {
      id: this.queryId,
    };
    this.options.forEach((item) => {
      if (this.form.get(item.id)?.value) {
        payLoad[item.id] = this.form.get(item.id)?.value;
      }
    })
    this.loading = true;
    this.au.confirmInvitation(payLoad).then((res) => {
      this.as.success('confirmInvitation', 'confirmInvitationSuccess', null, 1000);  
      this.as.keepAfterRouteChange=true;
      this.router.navigate(['/']);
     }
      , err => {
        this.as.error('confirmInvitation', 'confirmInvitationError', null, 10000);  
        this.as.keepAfterRouteChange=true;
        this.au.logout(this.queryUser);
       })
      .finally(() => { this.loading = false; });
  }

}


