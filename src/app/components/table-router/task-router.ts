import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector:'task-router',
  imports:[RouterOutlet],
  template:`
    <router-outlet></router-outlet>
  `,
  styles:``
})
export class TaskRouter {

}
