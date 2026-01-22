import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { BackendService } from '../backend/backend';
import { taskViewInterface } from '../../interfaces/task.interface';
import { ConfigType } from '../../interfaces/forms.interface';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  
  private allTaskSubject = new BehaviorSubject<taskViewInterface[] | null>(null);

  constructor(
    private backendService:BackendService,
  ){}

  public queryAllTask(id:number){
    this.backendService.getTableTasks<taskViewInterface[]>(id).subscribe({
      next: (result) => this.allTaskSubject.next(result.data),
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  public filteredTasks(id: number, filter: ConfigType = 'categories'): taskViewInterface[] {
    const allTasks = this.allTaskSubject.getValue();
    if (!allTasks) return [];
    if (id === 0) return allTasks;
    return allTasks.filter(task => {
      switch (filter) {
        case 'categories':
          return task.CID === id;
        case 'statuses':
          return task.SID === id;
        case 'threatLevels':
          return task.TID === id;
        default:
          return false;
      }
    });
  }
}
