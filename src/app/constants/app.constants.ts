export class Operations {

    public static readonly CREATE_USER = 'create_user';
    public static readonly EDIT_USER = 'edit_user';
    public static readonly DELETE_USER = 'delete_user';
    public static readonly VIEW_USER = 'view_user';
    public static readonly VIEW_USER_DETAILS = 'view_user_details';
    public static readonly VIEW_USER_ROLES = 'view_user_roles';
    public static readonly ASSIGN_USER_ROLES = 'assign_user_roles';
    public static readonly SEARCH_USER = 'search_user';
    public static readonly INVITE_USER = 'invite_user';
    public static readonly MANAGE_USER = 'manage_user';

    public static readonly USER_OPERATIONS = new Array(Operations.CREATE_USER, Operations.EDIT_USER, Operations.DELETE_USER, Operations.VIEW_USER,
        Operations.VIEW_USER_DETAILS, Operations.VIEW_USER_ROLES, Operations.ASSIGN_USER_ROLES, Operations.SEARCH_USER, Operations.MANAGE_USER);

    public static readonly CREATE_GROUP = 'create_group';
    public static readonly EDIT_GROUP = 'edit_group';
    public static readonly DELETE_GROUP = 'delete_group';
    public static readonly VIEW_GROUP = 'view_group';
    public static readonly VIEW_GROUP_DETAILS = 'view_group_details';
    public static readonly ASSIGN_GROUP_ROLES = 'assign_group_roles';
    public static readonly SEARCH_GROUP = 'search_group';

    public static readonly GROUP_OPERATIONS = new Array(Operations.CREATE_GROUP, Operations.EDIT_GROUP, Operations.DELETE_GROUP, Operations.VIEW_GROUP,
        Operations.VIEW_GROUP_DETAILS, Operations.SEARCH_GROUP);

    public static readonly SEARCH_PROJECT = 'search_project';
    public static readonly CREATE_PROJECT = 'create_project';
    public static readonly EDIT_PROJECT = 'edit_project';
    public static readonly DELETE_PROJECT = 'delete_project';
    public static readonly VIEW_PROJECT_DETAILS = 'view_project_details';
    public static readonly ASSIGN_PROJECT_ROLES = 'assign_project_roles';

    public static readonly PROJECT_OPERATIONS = new Array(Operations.CREATE_PROJECT, Operations.EDIT_PROJECT, Operations.DELETE_PROJECT, Operations.VIEW_PROJECT_DETAILS,
        Operations.ASSIGN_PROJECT_ROLES, Operations.SEARCH_PROJECT);

    public static readonly CREATE_DOCUMENT = 'create_document';
    public static readonly EDIT_DOCUMENT = 'edit_document';
    public static readonly DELETE_DOCUMENT = 'delete_document';
    public static readonly DOWNLOAD_DOCUMENT = 'download_document';
    public static readonly VIEW_DOCUMENT_BASIC_DETAILS = 'view_document_basic_details';

    public static readonly DOCUMENT_OPERATIONS = new Array(Operations.CREATE_DOCUMENT, Operations.EDIT_DOCUMENT, Operations.DELETE_DOCUMENT, Operations.DOWNLOAD_DOCUMENT,
        Operations.VIEW_DOCUMENT_BASIC_DETAILS);

    public static readonly SIDE_NAV_OPERATIONS = new Array(Operations.SEARCH_USER, Operations.CREATE_USER, Operations.SEARCH_GROUP, Operations.CREATE_GROUP,
        Operations.SEARCH_PROJECT, Operations.CREATE_PROJECT, Operations.CREATE_DOCUMENT, Operations.DOWNLOAD_DOCUMENT, Operations.ASSIGN_GROUP_ROLES, 
        Operations.VIEW_DOCUMENT_BASIC_DETAILS);

    public static readonly STANDALONE_OPERATIONS = new Array(Operations.ASSIGN_USER_ROLES);

    public static isStandaloneOperation(op: string) {
        return this.isOperation(op, Operations.STANDALONE_OPERATIONS);
    }

    public static isUserOperation(op: string) {
        return this.isOperation(op, Operations.USER_OPERATIONS);
    }

    public static isGroupOperation(op: string) {
        return this.isOperation(op, Operations.GROUP_OPERATIONS);
    }

    public static isProjectOperation(op: string) {
        return this.isOperation(op, Operations.PROJECT_OPERATIONS);
    }

    public static isDocumentOperation(op: string) {
        return this.isOperation(op, Operations.DOCUMENT_OPERATIONS);
    }

    public static isSideNavOperation(op: string) {
        return this.isOperation(op, Operations.SIDE_NAV_OPERATIONS);
    }

    private static isOperation(op: string, ops: Array<string>) {
        if (op === null) {
            return false;
        }
        return ops.includes(op);
    }
}