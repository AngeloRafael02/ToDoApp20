export interface taskInterface {
    id?:number
    title:string
    note?:string
    cat_id:number
    prio?:number
    stat_id:number
    threat_id?:number
    created_at?:Date | string
    last_edited?:Date | string
    deadline?:Date | string
    owner_id:number
}

export interface taskViewInterface{
    ID:number
    Title:string
    Description?:string
    Priority?:number,
    "Threat Level":number,
    "Created At":Date | string
    "Last Edited":Date | string
    Deadline:Date
    Category:string
    Status:string
    SID:number
    TID:number
    UID:number
    CID:number
}