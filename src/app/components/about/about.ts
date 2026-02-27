import { Component, HostListener, OnInit, signal } from "@angular/core";
import { filter, forkJoin, take } from "rxjs";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from '@angular/material/tabs';

import { DropdownDataService } from '../../services/dropdown-data/dropdown-data';
import { Modal } from "../modal/modal";
import { AppKeybind, TaskPart } from "../../interfaces/misc.interface";


@Component({
  selector: 'about',
  imports: [
    MatIconModule,
    MatTabsModule,
    Modal
  ],
  template: `
    <button matMiniFab>
      <mat-icon aria-hidden="false" aria-label="Web App Help" fontIcon="help" (click)="isAboutComponentVisible.set(true)"></mat-icon>
    </button>
    <modal [visible]="isAboutComponentVisible()" [title]="'About'" (close)="isAboutComponentVisible.set(false)" [width]="'600px'">
      <mat-tab-group>
        <mat-tab label="Tasks">
          <h2>Welcome to ToDoApp20</h2>
          <p>This is an To-Do-List App to manage tasks</p>
          <table>
            <caption>
              <h3>Parts of a Task</h3>
            </caption>
            <thead>
              <tr>
                <th>Column</th>
                <th>Definition</th>
                <th>Input Type</th>
                <th>Constraints/Specifications</th>
              </tr>
            </thead>
            <tbody>
              @for (part of taskParts; track part){
              <tr>
                <td>{{ part.input }}</td>
                <td>{{ part.definition }}</td>
                <td>{{ part.inputType }}</td>
                <td>
                  <ul>
                    @for (spec of part.specs;track spec) {
                    <li>
                      @if (spec.includes('selection')) {
                        Only a fixed <abbr [title]="getAbbrValue(part.input)">selection</abbr>
                      } @else {
                        {{ spec }}
                      }
                    </li>
                    }
                  </ul>
                </td>
              </tr>
              }
            </tbody>
          </table>
        </mat-tab>

        <mat-tab label="Shotcuts">
              <table>
                <thead>
                  <tr>
                    <th>Command</th>
                    <th>Keybind</th>
                  </tr>
                </thead>
                <tbody>
                  @for (keybind of appKeybinds; track keybind) {
                    <tr>
                      <td>{{ keybind.command }}</td>
                      <td><code>{{ keybind.keybind }}</code></td>
                    </tr>
                  }
                </tbody>
              </table>

        </mat-tab>
      </mat-tab-group>

    </modal>
  `,
  styles: `
    button {
      background-color: transparent;
      box-shadow: none;
      color: var(--app-primary-text);
    }
    table {
      border:1px solid black;
      td, th {
        border:1px solid black;
        padding-left:1rem;
        padding-right:1rem;
        ul {
          padding-left:10px;
        }
      }
    }
  `
})
export class AboutComponent implements OnInit {

  public readonly isAboutComponentVisible = signal(false);
  private errorMessage: string = 'Error on fetching Data';
  public categoriesAbbr: string = '';
  public statusAbbr: string = '';
  public threatLevelAbbr: string = '';

  public taskParts: TaskPart[] = [
    { input: 'Title', definition: 'Name of the task.', inputType: 'String', specs: ['Cannot be less than 3 characters'] },
    { input: 'Deadline', definition: 'Your perceived time', inputType: 'Date', specs: ['Can be skipped'] },
    { input: 'Description', definition: 'Details of your task.', inputType: 'String', specs: ['Can be skipped'] },
    { input: 'Category', definition: 'What kind of task it is.', inputType: 'String', specs: ['Only a fixed selection'] },
    { input: 'Priority', definition: 'How the user marks to do in order.', inputType: 'Number', specs: ['Cannot be less than 1'] },
    { input: 'Threat Level', definition: 'How important a task is.', inputType: 'String', specs: ['Only a fixed selection'] },
    { input: 'Status', definition: 'he current condition of the Task.', inputType: 'String', specs: ['Only a fixed selection', `Task is considered 'Unfinished' by default when creating new tasks`] },
  ];

  public appKeybinds:AppKeybind[] = [
    { command:'Open Help Dialog', keybind:'alt + r'},
    { command:'Open Stats', keybind:'alt + e'},
  ]

  constructor(
    private dropdownService: DropdownDataService
  ) { }

  @HostListener('window:keydown', ['$event'])
  public toggleHelpIcon(event: KeyboardEvent) {
    if (event.altKey && event.key.toLocaleLowerCase() === 'r') {
      event.preventDefault();
      this.isAboutComponentVisible.update((value:boolean) => !value)
    }
  }

  ngOnInit(): void {
    forkJoin({
      categories: this.dropdownService.categories$.pipe(take(1)),
      status: this.dropdownService.statuses$.pipe(take(1)),
      threats: this.dropdownService.threatLevels$.pipe(take(1)),
    }).pipe(
      filter(res => !!res.categories && !!res.status && !!res.threats)
    ).subscribe({
      next: (results) => {
        this.categoriesAbbr = results.categories?.map(obj => obj.cat).join(', ') || this.errorMessage;
        this.statusAbbr = results.status?.map(obj => obj.stat).join(', ') || this.errorMessage;
        this.threatLevelAbbr = results.threats?.map(obj => obj.level).join(', ') || this.errorMessage;
      },
      error: (err) => {
        console.error(err);
        this.categoriesAbbr = this.statusAbbr = this.threatLevelAbbr = this.errorMessage;
      }
    })
  }

  public getAbbrValue(column: string): string {
    if (column === 'Category') return this.categoriesAbbr;
    if (column === 'Status') return this.statusAbbr;
    if (column === 'Threat Level') return this.threatLevelAbbr;
    return '';
  }
}
