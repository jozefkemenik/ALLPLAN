import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DocumentsService } from 'src/app/services/documents.service';

import { GroupService } from 'src/app/services/group.service';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectPageDialogComponent, ProjectPageDialogProvider } from 'src/app/ui/dialogs/project-page-dialog/component/project-page-dialog.component';
import { ExpansionExpandCollapseComponent, ExpansionPanelAction, EmptySituation } from 'src/app/ui/expansion-expand-collapse/component/expansion-expand-collapse.component';
import { AlertService } from '../../../../services/alert.service';
import { BreadcrumbsService } from 'src/app/features/breadcrumbs/breadcrumbs.service';

@Component({
  selector: 'ap-companies',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListComponent {
  data: any;
  @ViewChild(ExpansionExpandCollapseComponent, { static: true }) expansionPanel: ExpansionExpandCollapseComponent;
  expandedPanel_groupId: string = "";
  marked_projectId: string = "";
  ignoreExpand = false;


  executeOpenExpansionPanelAction: string; //for now like this, in future if there is more actions send to panel we need to change output

  constructor(protected groupService: GroupService,
    protected projectService: ProjectService,
    protected documentService: DocumentsService,
    private dialog: ProjectPageDialogProvider,
    private alertService: AlertService,
    private router: Router,
    private bs: BreadcrumbsService) {
  }

  ngOnInit(): void {
    const companyId = this.bs.params["_idCompany"];
    if (companyId) {
      this.ignoreExpand = true;
      this.executeOpenExpansionPanelAction = companyId; //this will need to change if there is more data send to expansionpanel
    }

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.expansionPanel.setDataService(this.getService());
    this.expansionPanel?.setConfig(this.getExpansionConfig());
    this.expansionPanel.getInitialData();
  }

  protected getService() {
    return this.groupService;
  }

  protected getExpansionConfig() {
    return {
      expansionPanelHeader: "group",
      expansionPanelBody: "projects",
      expansionIcons: [],
      expansionContext: "project",
      expansionInstance: "OVERVIEW",
      expansionTitle: "COMPANIES",
      emptyExpansionPanelHeader: new EmptySituation("custom-empty-company-icon", 'emptycompanies1', 'emptycompanies2'),
      emptyExpansionPanelBody: new EmptySituation("custom-empty-project-icon", 'emptyprojects1', 'emptyprojects2'),
      expansionPanelHeader_ActionName: "company_action", //name of column in data object
      expansionPanelBody_ActionName: "project_action", //name of column in data object
      executeActionBodyPanel_click: "viewDocFlag"
    };
  }



  executeExpansionPanelAction(action: any) {
    // TODO trigger action on table
    switch (action.name) {
      case ExpansionPanelAction.DATA_RECEIVED: {
        this.expansionPanel.postProcessData(() => { return this.addActionsForRow(action.data); });
        break;
      }
      default:
    }
  }

  //todo change here for projects if flag will be different for every project
  //EXP .... shortcut for... EXPANSION PANEL
  private addActionsForRow(eventData: any) {
    var rowDataWithActions = [];
    eventData.data.forEach(rowData => {
      rowData["company_action"] = [
        {
          action: "dialog_create",
          tooltip: (rowData["crtProjFlag"] == undefined || rowData["crtProjFlag"] == 0) ? 'createProject2' : 'createProject1',
          icon: "custom-create-project-icon",
          disabled: (rowData["crtProjFlag"] == undefined || rowData["crtProjFlag"] == 0) ? true : false,
          id: 1
        },
        {
          action: "goto_company",
          tooltip: (rowData["infoCompFlag"] == undefined || rowData["infoCompFlag"] == 0) ? 'companyInfo2' : 'companyInfo1', //todo  empty for now
          icon: "custom-goto",
          disabled: (rowData["infoCompFlag"] == undefined || rowData["infoCompFlag"] == 0) ? true : false,
          id: 2
        }
        // todo new for header here icons here
      ];
      if (eventData.data.length === 1) { rowData.group["expanded"] = true; }
      else {
        if (this.expandedPanel_groupId.length > 0 && rowData.group.id === this.expandedPanel_groupId) {
          rowData.group["expanded"] = true;
          this.expandedPanel_groupId = "";
        } else {
          rowData.group["expanded"] = false;
        }
      }
      //functionality for router when you are going back from companyName to project and you want last open Expansansion panel have opend
      if (this.executeOpenExpansionPanelAction !== undefined && this.executeOpenExpansionPanelAction.length > 0 && rowData.group.id === this.executeOpenExpansionPanelAction) {
        rowData.group["expanded"] = true;
        this.executeOpenExpansionPanelAction = "";
      }


      rowData["project_action"] = [
        // {
        //   action: "add_document",
        //   tooltip: 'Add document',//todo when dissable change to You do not have the right role for the function
        //   icon: "custom-create-project-icon",
        //   //disabled: (rowData["crtDocFlag"] == undefined || rowData["crtDocFlag"] == 0) ? true : false, //|| (icon.action == 'add_document' && !item2.crtDocFlag)
        //   disabled: false,
        //   id: 2
        // },
        {
          action: "dialog_delete",
          tooltip: (rowData["delProjFlag"] == undefined || rowData["delProjFlag"] == 0) ? 'deleteProject2' : 'deleteProject1',
          icon: "custom-delete-project-icon",
          disabled: (rowData["delProjFlag"] == undefined || rowData["delProjFlag"] == 0) ? true : false,
          id: 1
        },
        // {
        //   action: "goto_project",
        //   tooltip: "Project info", //todo  empty for now
        //   icon: "custom-goto",
        //   disabled: false,
        //   id: 3
        // }
      ];
      rowDataWithActions.push(rowData);

      if (rowData.projects !== undefined && rowData.projects !== null) {
        rowData.projects.forEach(project => {
          //console.log('CreateDocumentFlag' + project.crtDocFlag);
          if (project.id === this.marked_projectId) {
            project["marked"] = true;
            setTimeout(() => {
              project["marked"] = false;
            }, 10000);
            this.marked_projectId = "";
          } else {
            project["marked"] = false;
          }

        });
        //mark newly created project
      }


    });
    return rowDataWithActions;
  }


  executeIconAction(data: any) {
    //add here neccassary data for general dialog, set is as new variable to object data, do not wrap data in other variable 
    let newData = {};
    newData["action"] = data.action;
    newData["dialogHTML_Id"] = data.data.dialogHTML_Id;

    switch (data.action) {
      case "dialog_create":
        newData["name"] = data.data.name;
        newData["title"] = 'dialog_createProject1';
        newData["warningNotification"] = 'notification_warning_characters';
        newData["inputHeader"] = 'dialog_createProject2';
        this.callDialogAction(data, newData);
        break;
      case "dialog_delete":
        newData["name"] = data.data.name2;
        newData["title"] = 'dialog_deleteProject1';
        newData["message"] = 'dialog_deleteProject2';
        this.callDialogAction(data, newData);
        break;
      case "add_document":
        newData["name"] = data.data.name2;
        newData["title"] = 'Upload';
        newData["message"] = 'Upload File';
        this.callDialogAction(data, newData);
        break;
      case "goto_company":
        this.router.navigate(["/company", data.data.id]);
        break;
      // case "goto_project":
      //   let map2 = new Map<string, string>();
      //   map2.set(data.data.id, data.data.name);
      //   map2.set(data.data.id2, data.data.name2);
      //   let urlConf2 = [undefined, { redirectTo: "/projects", state: { companyId: data.data.id } }, undefined]; // /project/companyId/projectId
      //   this.dataBreadCrumbService.setValue({ map: map2, urlConfig: urlConf2 });
      //   this.router.navigate(["/projects", data.data.id, data.data.id2], { state: { map: map2, urlConfig: urlConf2 } });//state is send back to /project with history.state
      //   break;

      default:
        break;
    }
  }

  callDialogAction(data: any, newData: any) {
    //resove callback from dialog
    newData.clickPromise = (val:any)=>{
      return new Promise((res,rej)=>{
        switch(val.event){
          case 'Create':
            this.groupService.createNewProject(val.name, data.data.id).then((result: any) => {
              if (result.successful) {
                this.expandedPanel_groupId = data.data.id;
                this.marked_projectId = result.response.body.id;
                this.bs.removeInsertedItemByName("_idCompany");
                this.expansionPanel.getInitialData();
                this.alertService.clear(result.alertInfo);
                this.alertService.success('alert_project_create_success', '', null, 5000);
                res(true);
              }
              else{
                res(false);
              }
              //todo here if error occured
            }).catch((err)=>{
              res(true);
            });;
            break;
            case 'Delete':
              this.projectService.deleteProject([data.data.id2]).then((result: any) => {   
                if (result.successful) {
                  this.expandedPanel_groupId = data.data.id;
                  this.bs.removeInsertedItemByName("_idCompany");
                  this.expansionPanel.getInitialData();
                  res(true);
                }
                else{
                  res(false);
                }
              }).catch((err)=>{
                res(true);
              });
              break;
        }
      })
    }
    this.dialog.open({
      //width: '340px',
      //height: '267px',
      panelClass: 'generall-dialog', //todo change here if you want for every dialog other settings
      disableClose: true,
      data: newData
    });


    //   switch (result.event) {
    //     case "Create":
      
    //       this.groupService.createNewProject(result.name, data.data.id).then((result: any) => {
    //         if (result.successful) {
    //           this.expandedPanel_groupId = data.data.id;
    //           this.marked_projectId = result.response.body.id;
    //           this.bs.removeInsertedItemByName("_idCompany");
    //           this.expansionPanel.getInitialData();
    //           this.alertService.clear(result.alertInfo);
    //           this.alertService.success('alert_project_create_success', '', null, 5000);
    //         }
    //         //todo here if error occured
    //       });
    //       break;
    //     case "Delete":
    //       this.expansionPanel.letPanelOpen = true;
    //       this.projectService.deleteProject([data.data.id2]).then((result: any) => {
    //         if (result.successful) {
    //           this.expandedPanel_groupId = data.data.id;
    //           this.bs.removeInsertedItemByName("_idCompany");
    //           this.expansionPanel.getInitialData();
    //         }
    //       });

    //       break;

    //     case "UploadFile":
    //       this.expansionPanel.letPanelOpen = true;
    //       console.log('Result.documentName ' + result.documentName);
    //       const requestData = {
    //         docIdentifier: result.docIdentifier,
    //         documentName: result.documentName,
    //         planType: result.planType,
    //         layoutNumber: result.layoutNumber,
    //         revisionTitle: result.fileName,
    //         revisionName: "6485", //just added a dummy value so as it is clear that 'revisionName' is not equal to 'result.fileName',
    //         revisionFileSize: result.file.size,
    //         fileExtension: result.fileName.split('.').pop(),
    //       };
    //       //console.log(data.data.id);
    //       this.documentService.createDocument(data.data.id2, requestData).then((createDocumentresult: any) => {
    //         if (createDocumentresult.preSignedUrl) {
    //           console.log('createDocument - OK: ' + createDocumentresult.preSignedUrl);
    //           const completeRequestData = {
    //             revisionId: createDocumentresult.revisionId,
    //             revisionTitle: result.fileName
    //           };
    //           this.documentService.uploadFileToS3bucket(result.file, createDocumentresult.revisionId, createDocumentresult.preSignedUrl).then((result: any) => {
    //             if (result.successful) {
    //               console.log('uploadFileToS3bucket - OK: Upload done');


    //               this.documentService.completeDocumentCreation(data.data.id2, completeRequestData).then((result: any) => {
    //                 this.alertService.success('File has been uploaded successfully', "", null, 5000);
    //                 console.log('completeDocumentCreation - OK: ' + result.Url);
    //               }, (err) => {
    //                 this.alertService.error('Error in completeDocumentCreation', '', null, 5000);
    //                 console.error('completeDocumentCreation', err);
    //               });

    //             }
    //           });
    //         }
    //       }, (err) => {
    //         this.alertService.error('Error in createDocument', '', null, 5000);
    //         console.error('createDocument', err);
    //       })
    //         ;

    //       break;
    //     default:
    //       break;
    //   }

    // });
  }





  executeExpansionPanelBodyClickAction(data: any) {
    if (data.data.canClickOnBodyItem) {
      this.router.navigate([`/companies/${data.data.id}/project/${data.data.id2}`]);
    } else
      console.log("no rights"); //todo later change for toast message maybe
  }

  executeToggleEvent(group: any) {
    //this is for ignoring first autoexpand on init if happens
    if (this.ignoreExpand) {
      this.ignoreExpand = false;
      return;
    }
    if (group && group.expanded) {
      this.bs.insertItem(group.name, group.id, "_idCompany");
    } else {
      this.bs.removeInsertedItem(group.id);
    }

  }


}
