export interface dialogDataInterface{
    allCat:categoriesInterface[]
    allCond:conditionInterface[],
    allThr:threatInterface[],
    option:string,
    ID:number
}

export interface conditionInterface {
    id:number
    stat:string
}

export interface categoriesInterface {
    id:number
    cat:string
}

export interface threatInterface {
    id:number
    level:string
}

export interface ssrResObj {
    status:string,
    count?:number,
    message?:string,
    data:categoriesInterface[] | threatInterface[] | conditionInterface[]
}