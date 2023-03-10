export class DocumentRevision {
    id: string;
    fileName: string;
    index: string;
    indexCreator: string;
    indexDate?: Date;
    indexNote: string;
    uploadBy: string;
    assignmentDate?: Date;
    lastDownloadDate?: Date;
}