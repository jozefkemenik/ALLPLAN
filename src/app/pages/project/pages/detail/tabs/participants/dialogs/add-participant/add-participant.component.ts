import { Component, ElementRef, Inject, Injectable, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataAndTotalCountResult } from '@shared/models/api/DataAndTotalCountResult';
import { ProjectWithRole, RoleTemplate, TeamWithRole } from '@shared/models/api/Role';
import { AutocompleteData, AutocompleteItems, LogoColorCircle } from '@shared/models/autocomplete';
import { throwError } from 'rxjs';
import { TranslationService } from 'src/app/core/services/translation.service';
import { AlertService } from 'src/app/services/alert.service';
import { AddParticipantService } from './add-participant.service';
import { RolesService } from 'src/app/shared/services/roles.service';




@Component({
  selector: 'ap-participants-dialogs-add-participant',
  templateUrl: './add-participant.component.html',
  styleUrls: ['./add-participant.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddParticipantDialogComponent implements OnInit {

  messageText: string = "";
  autocompleteItems: any;

  projectId: string;
  companyId: string;

  dropDownItems: RoleTemplate[];
  chips: AutocompleteItems[] = [];

  autocomplementeinputText: string = "";

  isLoading: boolean = false;
  selectedRole: RoleTemplate = null;

  addBtn_isLoading: boolean = false;

  autocomplete_isLoading: boolean = false;

  dialogResponse: boolean = false;

  private readonly triggerElementRef: ElementRef; // to get dialog to exact position

  currentUserEmail: string;
  inputAutocompleteValue: string = "";
  emptyAutocompleteInput: boolean = true;

  constructor(public dialogRef: MatDialogRef<AddParticipantDialogComponent>,
    private ts: TranslationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private addParticipantService: AddParticipantService,
    private alertService: AlertService,
    private rolesService: RolesService) {
    this.projectId = data.dataKey.projectId;
    this.companyId = data.dataKey.companyId;
    this.currentUserEmail = data.dataKey.email;
    this.triggerElementRef = data.dataKey.trigger;
    this.autocomplementeinputText = ts.translate("nameOrEmail");
    this.dropDownItems = new Array<RoleTemplate>();
    this.setBtnRoles();
  }

  ngOnInit() {
    const matDialogConfig: MatDialogConfig = new MatDialogConfig();
    // const rect = this.triggerElementRef.nativeElement.getBoundingClientRect();
    // matDialogConfig.position = { left: `${rect.left - 256}px`, top: `${rect.bottom - 0}px` };
    // this.dialogRef.updatePosition(matDialogConfig.position);
  }

  cancel() {
    this.dialogRef.close("cancel"); //send false to not refresh table
  }


  setDataForAutocomplete(item: AutocompleteData) {
    if (item.requestdata) {
      let query = { pageIndex: 0, pageSize: 20, searchTerm: item.searchTerm, sortingConfig: ["@name"], companyId: this.companyId, projectId: this.projectId };
      this.autocomplete_isLoading = true;
      this.addParticipantService.getItemsForAutocomplete(query).then(
        (res: DataAndTotalCountResult<TeamWithRole>) => {
          let result = new Array<AutocompleteItems>();
          //todo test functionality after BE approved
          res.data.forEach(el => {
            if (el.user.email !== this.currentUserEmail && !this.itemInChips(el.user.email)) {
              let element = new AutocompleteItems();
              element.id = el.user.id;
              element.subtitle = el.user.name;
              element.title = el.user.email;
              element.iconText = el.user.firstName.charAt(0).toUpperCase() + el.user.lastName.charAt(0).toUpperCase();
              element.iconCircleColor = this.getTextColor(el.user.email);
              result.push(element);
            }
          });
          this.autocompleteItems = result;
          return result;
        },
        // not 200
        err => {
          return err;
        }
      ).finally(() => {
        this.autocomplete_isLoading = false;
      });
      return;
    }
    this.inputAutocompleteValue = item.searchTerm;
    this.emptyAutocompleteInput = item.emptyInput;
  }

  itemInChips(title: string) {
    for (let i = 0; i < this.chips.length; i++) {
      if (this.chips[i].title === title) //title = email
        return true;
    }
    return false;
  }

  selectRole(item: RoleTemplate) {
    this.selectedRole = item;
  }

  setBtnRoles() {
    this.isLoading = true;
    this.rolesService.getRolesByProjectId(this.projectId).then(r => {
      this.dropDownItems = r.map(m => { return RoleTemplate.load(m); })
    }).finally(() => {
      this.isLoading = false;
    })
  }

  getTextColor(text: string): LogoColorCircle {
    let color = this.getColorFromText(text);
    let rgbFromHex = this.hexToRgb(color);

    let result = new LogoColorCircle();
    result.backgroundColor = color;
    let R = rgbFromHex.r;
    let G = rgbFromHex.g;
    let B = rgbFromHex.b;

    let C = [R / 255, G / 255, B / 255];

    for (var i = 0; i < C.length; ++i) {
      if (C[i] <= 0.03928) {
        C[i] = C[i] / 12.92
      } else {
        C[i] = Math.pow((C[i] + 0.055) / 1.055, 2.4);
      }
    }

    let L = 0.2126 * C[0] + 0.7152 * C[1] + 0.0722 * C[2];

    if (L > 0.179) {
      result.textColor = "#000000DE";
    } else {
      result.textColor = "#FFFFFF";
    }
    return result;
  }

  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  getColorFromText(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).slice(-2);
    }
    return colour;
  }

  addParticipant(event: any) {
    //let requestBody = { emails: this.chips, roleTemplateId: this.selectedRole.id, targetId: this.projectId };
    this.addBtn_isLoading = true;
    this.addParticipantService.addParticipants(this.chips as AutocompleteItems[], this.selectedRole.id, this.projectId).then(
      (res: any) => {
        this.dialogResponse = true;
        return true;
      },
      // not 200
      err => {
        let errorMessage = this.chips.length > 1 ? this.ts.translate('failedToAddParticipants') : this.ts.translate('failedToAddParticipant');
        this.alertService.error(errorMessage, '', null, 10000);
        throwError(err);
        return false;
      }
    ).finally(() => {
      if (this.dialogResponse) {
        this.addBtn_isLoading = false;
        this.dialogRef.close(this.chips);
      }
    });
  }

  getChipsData(chips: any) {
    this.chips = chips;
  }

  addParticipantDisabled() {
    if (this.selectedRole == null) {
      if (this.chips.length < 1) {
        return true;
      }
      return true;
    } else {
      if (this.chips.length < 1) {
        return true;
      } else {
        if (!this.emptyAutocompleteInput) {
          return true;
        }
        return false;
      }
    }
  }

}


@Injectable({ providedIn: 'root' })
export class AddParticipantDialogProvider {
  constructor(private dialog: MatDialog) {

  }
  public open(data: any): Promise<any> {
    return new Promise<any>((res, rej) => {
      const config = {
        disableClose: true, width: "380px", maxHeight: "50vh", data: { dataKey: data }, panelClass: "addParticipantDialog"
      };
      const dialogRef = this.dialog.open(AddParticipantDialogComponent, config);
      dialogRef.afterClosed().subscribe(result => {
        res(result);
      });

    })

  }

}