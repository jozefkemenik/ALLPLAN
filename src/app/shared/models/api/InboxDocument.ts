export class InboxDocument {
    id: string;
    documentName: string;
    projectName: string;
    companyName: string;
    planType?: string;
    dataType: string;
    uploadDate?: Date;
    notificationDate?: Date;
    downloadDate?: Date;
}