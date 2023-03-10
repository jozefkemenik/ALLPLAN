import { Component, ViewEncapsulation, Injectable, Inject, OnInit, } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RolesService } from 'src/app/shared/services/roles.service';
import { RoleTemplate } from 'src/app/shared/models/api/Role';
import { FormGroup, Validators, FormArray, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import { HttpService } from 'src/app/core/services/http.service';
import { AlertService } from 'src/app/services/alert.service';
import { TranslationService } from 'src/app/core/services/translation.service';
@Component({
  selector: 'ap-dialog-addmember',
  templateUrl: './dialog-addmember.component.html',
  styleUrls: ['./dialog-addmember.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogAddMemberComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  _listDesign: boolean = false;
  invalidEmails=[];
  roles = [];
  constructor(public dialogRef: MatDialogRef<DialogAddMemberComponent>,
    private rs: RolesService,
    private fb: FormBuilder,
    private http: HttpService,
    private as:AlertService,
    private ts:TranslationService,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.form = this.fb.group({
      emails: ['', this.ValidateEmails.bind(this)],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.rs.getRolesByCompanyId(this.data.companyId).then(r => {
      this.roles = r.map(m => {
        return { viewValue: RoleTemplate.load(m).tAssignedRole, value: m.id };
      })
    })
  }

  ValidateEmails(control: AbstractControl): { [key: string]: any } | null {
    
    this.invalidEmails = []
    if (control.value && control.value.length > 0) {
      this.emailList.forEach(val => {
        if (val.length) {
          if(!validateEmail(val)) this.invalidEmails.push(val);
        }
      });
      if (this.invalidEmails.length) {
        return { 'EmailsInvalid': true };
      }
      return null;
    }
    return { 'required': true };
  }


  inputTa(){
    this.formatEmails()
  }

  get emailList(){
    return this.form.controls.emails.value.split(';').map(m=>m.trim()).map(m=>m.replace(/\n|\r/g, ""));
  }

  formatEmails(){
      this.form.controls.emails.patchValue(this.emailList.join(';\n'));
  }
  invite() {
    this.loading = true;
    const payload =
    {

      "emails": this.emailList,
      "roleTemplateId": this.form.value.role,
      "targetId": this.data.companyId
    }
    
    this.http.post('users/invite', payload)
      .then((res) => {
        this.as.success(this.ts.translate('invitationSuccess'), '', null, 5000);
        this.dialogRef.close(false);
      },
        (err) => {
          this.as.error(this.ts.translate('invitationFailed'), '', null, 10000);
        })
      .finally(() => {
        this.loading = false;
      })
  }

  submit() {
    this.submitted = true;
    if (this.form.valid) {
      this.invite();
    }
  }
}





function validateEmail(email) {
  var re =/.+@\S+\.\S+$/;
  return re.test(email);
}

@Injectable({ providedIn: 'root' })
export class DialogAddMemberProvider {
  constructor(private dialog: MatDialog) {
  }
  public open(data: any): Promise<boolean> {
    return new Promise<any>((res, rej) => {
      const config = {
        disableClose: true,
        data: data,
        panelClass: "dialog-addmember"
      };
      const dialogRef = this.dialog.open(DialogAddMemberComponent, config);
      dialogRef.afterClosed().subscribe(result => {
        res(result);
      });
    })
  }
}


