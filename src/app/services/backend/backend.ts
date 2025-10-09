import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { taskInterface,taskViewInterface } from '../../interfaces/task.interface';
import { categoriesInterface,conditionInterface,threatInterface } from '../../interfaces/forms.interface';
import { chartDataInterface } from '../../interfaces/misc.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private nestJS:string = environment.nestJS_url;

  constructor(
    private http:HttpClient
  ) { }

  public getDropdownItems(option:string){
    switch (option){
      case 'categories':
        return this.http.get<categoriesInterface[]>(`${this.nestJS}/Misc/allCat`);
      case 'Status':
        return this.http.get<conditionInterface[]>(`${this.nestJS}/Misc/allCond`);
      case 'threat level':
        return this.http.get<threatInterface[]>(`${this.nestJS}/Misc/allThreats`);
      default: return {};
    }
  }

  public getTasks(id:number, table:string):Observable<taskViewInterface[]>{
    let API_URL_Path:string = this.nestJS;
    switch (table){
      case 'current':
        API_URL_Path += `/task/all/${id}`;
        break;
      case 'cancelled':
        API_URL_Path += `/task/allCancelled/${id}`;
        break;
      case 'finsihed':
        API_URL_Path += `/task/allFinished/${id}`;
        break;
      default: break;
    }
    return this.http.get<taskViewInterface[]>(API_URL_Path);
  }

  public getOneTaskByID(id:number):Observable<taskViewInterface>{
    return this.http.get<taskViewInterface>(`${this.nestJS}/task/${id}`)
  }

  public getColumnHeaders(table:string):Observable<string[]>{
    return this.http.get<string[]>(`${this.nestJS}/misc/col/${table}`);
  }

  public getChartData(id:number, option:string){
    switch (option){
      case 'categories':
        return this.http.get<chartDataInterface[]>(`${this.nestJS}/misc/catGrouped/${id}`);
      case 'Status':
        return this.http.get<chartDataInterface[]>(`${this.nestJS}/misc/statGrouped/${id}`);
      case 'threat level':
        return this.http.get<chartDataInterface[]>(`${this.nestJS}/misc/threatGrouped/${id}`);
      default: return {};
    }
  }

  public addTask(taskObj:taskInterface):Subscription{
    return this.http.post(`${this.nestJS}/task`,taskObj).subscribe(data => {
      console.log(data);
    });
  }

  public updateOneTask(taskObj:taskInterface, ID:number):Subscription{
    return this.http.put(`${this.nestJS}/task/${ID}`,taskObj).subscribe(data => {
      console.log(data);
    });
  }

  public finishOneTask(ID:number):Subscription{
    return this.http.put(`${this.nestJS}/task/finish/${ID}`,{}).subscribe(data=>{
      console.log(data)
    });
  }

  public deleteOneTask(taskID:number):Subscription{
    return this.http.delete(`${this.nestJS}/task/${taskID}`).subscribe(data => {
      console.log(data);
    });
  }
}

