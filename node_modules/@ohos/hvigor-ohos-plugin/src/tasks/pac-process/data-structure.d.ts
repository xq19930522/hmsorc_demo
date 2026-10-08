export interface DataLabel {
    label: string;
    purposes: string[];
    userLinked?: boolean;
    tracking?: boolean;
}
export interface DataProcess {
    dataType: string;
    dataLabels: DataLabel[];
}
export interface SpecialAPI {
    apiType: string;
    reasons: string[];
}
export interface PacFile {
    dataProcess?: DataProcess[];
    specialAPIs?: SpecialAPI[];
}
