import { messageInterface } from "./message.interface"

export interface chartDataInterface{
    name:string
    value:number
}

export type chartDataOrMessage = chartDataInterface[] | messageInterface