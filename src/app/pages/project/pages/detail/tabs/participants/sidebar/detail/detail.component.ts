import { Component, OnInit, Input, Output, EventEmitter,NgZone } from '@angular/core';
import { IdynamicControl } from '@shared/models/IdynamicControl';
import { EcontrolType } from '@shared/models/EcontrolType.enum';
import { TranslationService } from 'src/app/core/services/translation.service';
import { RolesService } from 'src/app/shared/services/roles.service';
import { RoleTemplate } from 'src/app/shared/models/api/Role';

@Component({
  selector: 'ap-project-participants-sidebar-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class ProjectParticipantsSidebarDetailComponent implements OnInit {


  @Input() projectId: string

  _isEdit: boolean = false;
  @Input() set isEdit(val: any) {
    this._isEdit = val;
    if (val) {
      this.initEditConfig();
    } else {
      this.initConfig();
    }
  };
  get isEdit() {
    return this._isEdit;
  }

 

  _data: any = {};
  @Input()
  set data(val: any) {
    this._data = val;
    if (val) {
      if (val)
        this._data.langaugeFull = this.ts.translate(this.ts.languages.find(f => f.icon == val.language).text);
    }
  };
  get data() {
    return this._data;
  }
  @Input() loading = false
  options: Array<IdynamicControl> = [];

 @Output() change = new EventEmitter();
 
  constructor(private ts: TranslationService, private rs: RolesService, private readonly zone: NgZone) { }

  ngOnInit(): void {
    this.initConfig();
  }

  initConfig() {
    this.options = [
      {
        id: "title",
        key: 'title',
        label: 'title',
        type: EcontrolType.text,
        readonly: true
      },
      {
        id: "firstName",
        key: 'firstName',
        label: 'firstName',
        type: EcontrolType.text,
        readonly: true
      },
      {
        id: "lastName",
        key: 'lastName',
        label: 'lastName',
        type: EcontrolType.text,
        readonly: true
      },
      {
        id: "mail",
        key: 'mail',
        label: 'userEmail',
        type: EcontrolType.text,
        readonly: true
      },
      {
        id: "salutation",
        key: 'salutation',
        label: 'salutation',
        type: EcontrolType.text,
        readonly: true
      },
      // {
      //   id: "",
      //   key: '',
      //   label: 'employerName',
      //   type: EcontrolType.text,
      //   readonly: true
      // },
      {
        id: "jobTitle",
        key: 'jobTitle',
        label: 'jobTitle',
        type: EcontrolType.text,
        readonly: true
      },
      {
        id: "langaugeFull",
        key: 'langaugeFull',
        label: 'language',
        type: EcontrolType.text,
        readonly: true
      },
      // {
      //   id: "timezone",
      //   key: 'timezone',
      //   label: 'timezone',
      //   type: EcontrolType.text,
      //   readonly: true
      // },
      {
        id: "projectRole",
        key: 'projectRole',
        label: 'projectRole',
        type: EcontrolType.dropDown,
        readonly: true
      }
    ]
  }

  initEditConfig() {
    this.options[this.options.length - 1] =
    {
      id: "projectRole",
      key: 'projectRoleId',
      label: 'projectRole',
      type: EcontrolType.dropDown,
      readonly: false,
      items: []
    }
    this.initRoles();
  }

  onChange(e){
    this.change.emit(e)
  }

  initRoles() {
    this.loading = true;
    this.rs.getRolesByProjectId(this.projectId).then(r => {
      const item = this.options[this.options.length - 1];
      item.items = r.map(m => {
        const translatedRole = this.ts.translate(RoleTemplate.load(m).tAssignedRole);
        return {
          text: translatedRole,
          value: m.id
        };
      });
    }).finally(() => {
      this.loading = false;

    })
  }




}
