import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { IdynamicControl } from '@shared/models/IdynamicControl';
import { EcontrolType } from '@shared/models/EcontrolType.enum';
import { TranslationService } from 'src/app/core/services/translation.service';
import { RolesService } from 'src/app/shared/services/roles.service';
import { RoleTemplate } from 'src/app/shared/models/api/Role';
import { DataAndTotalCountResult } from '@shared/models/api/DataAndTotalCountResult';
import { ITableConfig, EColumnConfigType } from '@shared/components/table/models/TableConfig.model';
import { ETableAction, TableAction, PayLoad } from '@shared/components/table/models/TableAction.model';
import { TableProvider } from '@shared/components/table/table.component';
import {CompanyMemberSidebarDetailDialogProjectsProvider} from '../../dialogs/projects/projects.component'

@Component({
  selector: 'ap-company-member-sidebar-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CompanyMemberSidebarDetailComponent implements OnInit {


  @Input() companyId: string

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
      this._data.langaugeFull = this.ts.translate(this.ts.languages.find(f => f.icon == val.language)?.text);
    }
    this.isShowMore =  val && val.roles && val.roles.length;
    this.tableProvider.refresh('company-detail-company-member-sidebar-detail')

  };
  get data() {
    return this._data;
  }
  @Input() loading = false
  options: Array<IdynamicControl> = [];

  @Output() change = new EventEmitter();


  dataTable: DataAndTotalCountResult<any>;
  tableConfig: ITableConfig;
  isShowMore:boolean=false;

  /** end table part */


  constructor(private ts: TranslationService, 
    private rs: RolesService,
    private readonly tableProvider: TableProvider,
    private dialogProvider: CompanyMemberSidebarDetailDialogProjectsProvider
    ) { }

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
        id: "email",
        key: 'email',
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
        id: "role",
        key: 'role',
        label: 'companyRole',
        type: EcontrolType.dropDown,
        readonly: true
      },
      {
        id: "nmbCurrentProjects",
        key: 'nmbCurrentProjects',
        label: 'currentProjects',
        type:  EcontrolType.text,
        readonly: true
      }, 
    ]
  }

  initEditConfig() {
    this.options[this.options.length - 1] =
    {
      id: "roleTemplateId",
      key: 'roleTemplateId',
      label: 'companyRole',
      type: EcontrolType.dropDown,
      readonly: false,
      items: []
    }
    this.initRoles();
  }

  onChange(e) {
    this.change.emit(e)
  }

  showMore() {
     this.dialogProvider.open(this._data);
  }

  initRoles() {
    this.loading = true;
    this.rs.getRolesByCompanyId(this.companyId).then(r => {
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

