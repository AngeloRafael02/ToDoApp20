export interface chartDataInterface{
    name:string
    value:number
    Color?:string
}

export interface PieSliceInterface {
  name: string;
  value: number;
  chartTitle: string;
}

export interface TaskPart {
  input: string;
  definition: string;
  inputType: string;
  specs: string[];
}

export interface AppKeybind {
  command: string;
  character: string;
}
