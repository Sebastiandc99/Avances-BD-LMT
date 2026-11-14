// Native visual identifiers verified against Microsoft's pre-February-2025
// Sales & Returns sample. UI labels such as "stackedColumnChart" are not IDs.
export const powerBiNativeRoles = {
 card:['Values'],slicer:['Values'],donutChart:['Category','Y'],
 columnChart:['Category','Y'],lineChart:['Category','Y'],
 pivotTable:['Rows','Columns','Values'],tableEx:['Values'],
 textbox:[],actionButton:[],image:[]
} as const;
export type PowerBiVisualType = keyof typeof powerBiNativeRoles;
