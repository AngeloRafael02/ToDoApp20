import { Component } from "@angular/core";
import { taskViewInterface } from "../../interfaces/task.interface";

@Component({
  selector:'about',
  template:`
    <h2>Welcome</h2>
    <p>This is an To-Do-List App to manage tasks</p>
    <table>
      <caption>
        <p>Parts of a Task</p>
      </caption>
      <thead>
        <tr>
          <th>Column</th>
          <th>Definition</th>
          <th>Input Type</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Title</td>
          <td></td>
          <td>String</td>
        </tr>
        <tr>
          <td>Deadline</td>
          <td></td>
          <td>Date</td>
        </tr>
        <tr>
          <td>Description</td>
          <td></td>
          <td>String</td>
        </tr>
        <tr>
          <td>Cateogry</td>
          <td></td>
          <td>String (fixed Selection)</td>
        </tr>
        <tr>
          <td>Priority</td>
          <td></td>
          <td>Numbers</td>
        </tr>
        <tr>
          <td>Threat Level</td>
          <td></td>
          <td>String (fixed Selection)</td>
        </tr>
        <tr>
          <td>Status</td>
          <td></td>
          <td>String (fixed Selection)</td>
        </tr>

      </tbody>
    </table>
  `,
  styles:`
  `
})
export class AboutComponent {
  public taskViewPattern:taskViewInterface;
}
