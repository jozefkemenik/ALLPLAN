export class LogoColorCircle {
    backgroundColor: string;
    textColor: string;
}

export class AutocompleteItems {
    id: string; //id send to BE to identify data which you send
    iconText?: string;
    title: string; //main value ne
    subtitle?: string;
    iconCircleColor?: LogoColorCircle; //color for text, color for background
}

export class AutocompleteData {
    requestdata: boolean;
    searchTerm: string;
    emptyInput: boolean;
}