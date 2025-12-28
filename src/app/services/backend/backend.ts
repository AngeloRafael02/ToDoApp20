import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { taskInterface } from '../../interfaces/task.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private nestJS:string = environment.nestJS_url;

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

  public getTableTasks<T>(id:number, status:number = 1): Observable<{ status: string; data: T }> {
    return this.http.get<{ status: string; data: T }>(`/tasks/all/${status}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(this.errorMsg(`${status} tasks`), error);
        return of({ status: 'error', data: [] as unknown as T });
      })
    );
  }

  public getHeaders<T>(table:string):Observable<{status:string; data:T}> {
    return this.http.get<{ status: string; data: T }>(`/tasks/columns/${table}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(this.errorMsg(`${table} headers`), error);
        return of({status:'error', data:[] as unknown as T});
      })
    );
  }

  public getChartData<T>(id:number,option:string):Observable<{status:string; data:T}>{
    return this.http.get<{ status: string; data: T }>(`/charts/${option}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(this.errorMsg(option), error);
        return of({status:'error', data:[] as unknown as T});
      })
    );
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

