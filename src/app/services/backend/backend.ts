import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { taskInterface,taskViewInterface } from '../../interfaces/task.interface';
import { environment } from '../../../environments/environment';
import { messageInterface } from '../../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private nestJS:string = environment.nestJS_url;
  private backupJSONPath:string = `/assets/data`;
  private miscAPIpath:string = `${this.nestJS}/misc`;
  private taskJSONpath:string = `${this.nestJS}/task`;
  private miscBackupPath:string = `${this.backupJSONPath}/misc`;
  private errorMsg = (option:string) => {
    return `API GET failed for ${option}. Falling back to local JSON.`
  }

  constructor(
    private http:HttpClient
  ) { }

  public getDropdownOptions<T>(option: string): Observable<{ status: string; data: T }> {
    return this.http.get<{ status: string; data: T }>(`/utils/${option}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(this.errorMsg(option), error);
        return of({ status: 'error', data: [] as unknown as T });
      })
    );
  }

  public getTasks(id:number, table:string = 'current'){
    let API_URL_Path:string = this.taskJSONpath;
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
        console.error(this.errorMsg(table), error);
        return this.http.get<messageInterface>(`${this.miscBackupPath}/error.json`);
      }));
  }

  public getOneTaskByID(id:number):Observable<taskViewInterface>{
    return this.http.get<taskViewInterface>(`${this.nestJS}/task/${id}`)
  }

  public getColumnHeaders(table:string):Observable<string[]>{
    return this.http.get<string[]>(`${this.miscAPIpath}/col/${table}`)
      .pipe(catchError((error:HttpErrorResponse)=> {
        console.error(this.errorMsg(table), error);
        return this.http.get<string[]>(`${this.miscBackupPath}/columns.json`);
      }));
  }

  public getChartData<T>(id:number,option:string):Observable<{status:string; data:T}>{
    return this.http.get<{ status: string; data: T }>(`/charts/${option}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(this.errorMsg(option), error);
        return of({status:'error', data:[] as unknown as T});
      })
    )
  }

  public addTask(taskObj:taskInterface):Observable<any>{
    return this.http.post(`${this.nestJS}/task`, taskObj);
  }

  public updateOneTask(taskObj:taskInterface, ID:number):Observable<any>{
    return this.http.put(`${this.nestJS}/task/${ID}`, taskObj);
  }

  public finishOneTask(ID:number): Observable<any> {
    return this.http.put(`${this.nestJS}/task/finish/${ID}`,{});
  }

  public deleteOneTask(taskID:number): Observable<any> {
    return this.http.delete(`${this.nestJS}/task/${taskID}`);
  }
}

