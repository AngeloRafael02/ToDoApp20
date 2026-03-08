import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { taskInterface } from '../../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

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
        return this.http.get<{ status: string; data: T }>(`/data/utils/${option}.json`);
      })
    );
  }

  public getTableTasks<T>(id:number, status:number = 0): Observable<{ status: string; data: T }> {
    return this.http.get<{ status: string; data: T }>(`/tasks/all/${status}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(this.errorMsg(`${status} tasks`), error);
        return this.http.get<{ status: string; data: T }>(`/tasks/all/0/1`)
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
        return this.http.get<{ status: string; data: T }>(`/data/utils/status`)
      })
    );
  }

  public addTask(taskObj: taskInterface): Observable<taskInterface> {
    return this.http.post<taskInterface>(`/tasks/new`, { task: taskObj });
  }

  public updateOneTask(taskObj: taskInterface, ID: number): Observable<any> {
    return this.http.put(`/tasks/update/${ID}`, { task: taskObj });
  }

  public finishOneTask(id:number) {
    return this.http.put(`tasks/finish`,{ id:id });
  }

  public deleteOneTask(id:number){
    let params = new HttpParams().set('id', id.toString());
    return this.http.delete(`tasks/delete/`,{ params:params });
  }
}

