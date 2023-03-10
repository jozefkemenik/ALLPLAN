import { Component, Inject, Injectable, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, SelectControlValueAccessor, Validators } from '@angular/forms';
import { AlertService } from '../../../../services/alert.service';

@Component({
  selector: 'app-general-dialog',
  templateUrl: './project-page-dialog.component.html',
  styleUrls: ['./project-page-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectPageDialogComponent implements OnInit {
  button1: boolean;
  button2: boolean;
  crtForm: UntypedFormGroup;
  uploadFileForm: UntypedFormGroup;
  aName: String = '';
  delete_checked: boolean = false;
  loading=false;



  // TODO : configuration should be passed from outside depending on context
  public getDialogConfig() {   //public ... because it is accessed from html
    return {
      maxLength: 100,
      restrictedPattern: '^(?!.*[\\\\/:*?"><|]).*',
      restrictedMessage: '\\ / : * ? " > < |'
    }
  }

  constructor(public dialogRef: MatDialogRef<ProjectPageDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private formBuilder: UntypedFormBuilder, 
  private alertService: AlertService) {
  }

  ngOnInit() {
    this.crtForm = this.formBuilder.group({
      itemName: ['', [Validators.required, Validators.maxLength(this.getDialogConfig().maxLength), Validators.pattern(this.getDialogConfig().restrictedPattern)]]
    });
    this.uploadFileForm = this.formBuilder.group({
      docIdentifier: ['', [Validators.required, Validators.maxLength(this.getDialogConfig().maxLength), Validators.pattern(this.getDialogConfig().restrictedPattern)]],
      documentName: ['', [Validators.required, Validators.maxLength(this.getDialogConfig().maxLength), Validators.pattern(this.getDialogConfig().restrictedPattern)]],
      planType: ['', [Validators.required, Validators.maxLength(this.getDialogConfig().maxLength), Validators.pattern(this.getDialogConfig().restrictedPattern)]],
      layoutNumber: ['', [Validators.required]],
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }


  isButton1Disabled() {
    return this.button1;
  }

  isButton2Disabled() {
    return this.button2;
  }

  // convenience getter for easy access to form fields
  get f() { return this.crtForm.controls; }

  checkDelete(checked: boolean) {
    this.delete_checked = checked;
  }

  deleteItem() {
    this.loading=true;
    this.data.clickPromise({ event: 'Delete' }).then((canClose)=>{
      this.loading=false;
      if(canClose){
        this.dialogRef.close();
        }
    })
  }

  createItem() {
    
    if (this.crtForm.controls.itemName.errors === null) {
      this.loading=true;
      this.alertService.clearAll();
      this.data.clickPromise({ event: 'Create', name: this.crtForm.value.itemName }).then((canClose)=>{
        this.loading=false;
        if(canClose){
        this.dialogRef.close();
        }
      })

    }
  }
}

@Injectable()
export class ProjectPageDialogProvider {

  constructor(private dialog: MatDialog) { }
  dialogRef: MatDialogRef<ProjectPageDialogComponent>;

  public open(data: any) {
    this.dialogRef = this.dialog.open(ProjectPageDialogComponent, data);
  }
}
