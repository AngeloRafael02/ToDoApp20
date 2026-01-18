export interface dropdownInterfaceBase {
  id:number
  color:string
}

export interface conditionInterface extends dropdownInterfaceBase {
  stat:string
}

export interface categoriesInterface extends dropdownInterfaceBase {
    cat:string
}

export interface threatInterface extends dropdownInterfaceBase {
    level:string
}

export type ConfigType = 'categories' | 'statuses' | 'threatLevels';
