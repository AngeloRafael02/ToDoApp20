import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { taskInterface,taskViewInterface } from '../../interfaces/task.interface';
import { categoriesInterface,conditionInterface,threatInterface } from '../../interfaces/forms.interface';
import { chartDataInterface } from '../../interfaces/misc.interface';
import { environment } from '../../../environments/environment';
import { messageInterface } from '../../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private nestJS:string = environment.nestJS_url;

  constructor(
    private http:HttpClient
  ) { }

  public getDropdownItems(option:string){
    let errorMessage:string =  `API GET failed for ${option}. Falling back to local JSON.`;
    let miscAPIpath:string = `${this.nestJS}/misc`;
    let backupJSONpath:string = `/assets/data/misc`;
    switch (option){
      case 'categories':
        return this.http.get<categoriesInterface[]>(`${miscAPIpath}/allCat`)
          .pipe(catchError((error: HttpErrorResponse) => {
            console.error(errorMessage, error);
            return this.http.get<categoriesInterface[]>(`${backupJSONpath}/categories.json`);
          }));
      case 'Status':
        return this.http.get<conditionInterface[]>(`${miscAPIpath}/allCond`)
          .pipe(catchError((error:HttpErrorResponse)=> {
            console.error(errorMessage, error);
            return this.http.get<conditionInterface[]>(`${backupJSONpath}/conditions.json`);
          }));
      case 'threat level':
        return this.http.get<threatInterface[]>(`${miscAPIpath}/allThreats`)
          .pipe(catchError((error:HttpErrorResponse) => {
            console.error(errorMessage, error);
            return this.http.get<threatInterface[]>(`${backupJSONpath}/threat-level.json`);
          }));
      default: 
        return this.http.get<messageInterface>(`${backupJSONpath}/error.json`);
    }    
  }

  public getTasks(id:number, table:string){
    let errorMessage:string =  `API GET failed for ${table}. Falling back to local JSON.`;
    let API_URL_Path:string = `${this.nestJS}/task`;
    let backupJSONpath:string = `/assets/data/taskSample`;
    switch (table){
      case 'current':
        API_URL_Path += `/all/${id}`;
        break;
      case 'cancelled':
        API_URL_Path += `/allCancelled/${id}`;
        break;
      case 'finsihed':
        API_URL_Path += `/allFinished/${id}`;
        break;
      default: 
        break;
    }
    return this.http.get<taskViewInterface[]>(API_URL_Path)
      .pipe(catchError((error:HttpErrorResponse) => {
        console.error(errorMessage, error);
        return this.http.get<messageInterface>(`${backupJSONpath}/table-error.json`);
      }));
  }

  public getOneTaskByID(id:number):Observable<taskViewInterface>{
    return this.http.get<taskViewInterface>(`${this.nestJS}/task/${id}`)
  }

  public getColumnHeaders(table:string):Observable<string[]>{
    let errorMessage:string =  `API GET failed for ${table}. Falling back to local JSON.`;
    return this.http.get<string[]>(`${this.nestJS}/misc/col/${table}`)
      .pipe(catchError((error:HttpErrorResponse)=> {
        console.error(errorMessage, error);
        return this.http.get<string[]>(`assets/data/misc/columns.json`);
      }));
  }

  public getChartData(id:number, option:string){
    let errorMessage:string =  `API GET failed for ${option}. Falling back to local JSON.`;
    let miscAPIpath:string = `${this.nestJS}/misc`;
    let backupJSONpath:string = `/assets/data/misc`;
    switch (option){
      case 'categories':
        miscAPIpath += `/catGrouped/${id}`;
        break;
      case 'Status':
        miscAPIpath += `/statGrouped/${id}`;
        break;
      case 'threat level':
        miscAPIpath += `/threatGrouped/${id}`;
        break;
      default: 
        break;
    }
    return this.http.get<chartDataInterface[]>(miscAPIpath)
      .pipe(catchError((error:HttpErrorResponse) => {
        console.error(errorMessage, error);
        return this.http.get<messageInterface>(`${backupJSONpath}/threat-level.json`);
      }));
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

