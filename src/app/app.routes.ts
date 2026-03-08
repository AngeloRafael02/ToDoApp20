import { Routes } from '@angular/router';
import { ErrorComponent } from './components/error/error';

export const routes: Routes = [
  { path: '', redirectTo: 'Status/All', pathMatch: 'prefix' },
  { path: 'Status/:status', loadComponent:() => import('./components/task-table/task-table').then(c => c.TaskTable) },
  { path: '**', redirectTo: 'Error' },
  { path: 'Error', component:ErrorComponent },
];
