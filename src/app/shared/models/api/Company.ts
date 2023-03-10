import { EColumnConfigType } from "@shared/components/table/models/TableConfig.model";

export class Company {
    id: string;
    name: string;
    customerNumber?: string;
    freeDiskSpace?: number;
    totalDiskSpace?: number;
    expirationDate?: string;
    costCenterId: string;
    signature: string;
}