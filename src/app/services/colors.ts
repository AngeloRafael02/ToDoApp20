import { Injectable } from '@angular/core';
import { DropdownDataService } from './dropdown-data/dropdown-data';

@Injectable({
  providedIn: 'root',
})
export class Colors {
  
  constructor(
    private DropdownService:DropdownDataService
  ){}

  
}
