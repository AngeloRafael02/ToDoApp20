import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { filter, Observable } from "rxjs";
import { MatTabChangeEvent, MatTabsModule } from "@angular/material/tabs";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { injectSpeedInsights } from '@vercel/speed-insights';
import { inject as injectAnalytics } from '@vercel/analytics';

import { DropdownDataService } from "../../services/dropdown-data/dropdown-data";
import { conditionInterface } from "../../interfaces/forms.interface";

@Component({
  selector:'task-router',
  imports:[
    CommonModule,
    RouterOutlet,
    MatTabsModule
  ],
  template:`
  <div>
    @if ((statuses$ | async) === null) {
      Loading tabs...
    }

    <mat-tab-group
      [selectedIndex]="activeTabIndex"
      (selectedTabChange)="onTabChange($event)"
      class="custom-tab-group">
      <mat-tab>
          <ng-template mat-tab-label>All</ng-template>
      </mat-tab>
      @for (tab of statuses$ | async; track tab) {
        <mat-tab>
          <ng-template mat-tab-label>{{tab.stat}}</ng-template>
        </mat-tab>
      }
    </mat-tab-group>

    <div class="content-transition-wrapper">
      <router-outlet></router-outlet>
    </div>
  </div>
  `,
  styles:`
    .custom-tab-group {
      ::ng-deep {
        .mdc-tab:hover .mdc-tab__ripple {
          background-color: var(--app-color3);
        }
        .mdc-tab--active {
          background-color: var(--app-color3);
          border-radius: 4px 4px 0 0;
          .mdc-tab__text-label {
            color: var(--app-primary-text);
          }
        }
        .mdc-tab__text-label {
          color: var(--app-primary-text);
        }
        .mdc-tab--active .mdc-tab__text-label {
          color: var(--app-primary-text);
        }
        .mat-mdc-tab-indicator .mdc-tab-indicator__content--underline {
          border-color: var(--app-primary-text);
        }
      }
    }

    .content-transition-wrapper {
      view-transition-name: table-content;
    }
  `
})
export class TaskRouter implements OnInit {
  public statuses$: Observable<conditionInterface[] | null>;
  public activeTabIndex = 0;
  private currentTabs: conditionInterface[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private dropdownService:DropdownDataService,
    private router: Router,
  ){}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      injectSpeedInsights();
      injectAnalytics();
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        injectSpeedInsights({
          route: event.urlAfterRedirects
        });
        injectAnalytics({
          endpoint: event.urlAfterRedirects
        });
      });
    }
    this.statuses$ = this.dropdownService.statuses$;
    this.statuses$.subscribe(tabs => {
      if (tabs) {
        this.currentTabs = tabs;
        this.router.events.pipe(
          filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
          this.syncTabHighlight();
        });
      }
    });
  }

  public onTabChange(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.router.navigateByUrl(`/Status/All`);
    } else {
      const selectedStat = encodeURIComponent(this.currentTabs[event.index - 1].stat);
      this.router.navigateByUrl(`/Status/${selectedStat}`);
    }
  }

private syncTabHighlight() {
    const url = this.router.url.toLowerCase();
    if (url.includes('/All')) {
      this.activeTabIndex = 0;
    } else {
      const index = this.currentTabs.findIndex(t =>
        url.includes(encodeURIComponent(t.stat).toLowerCase())
      );
      this.activeTabIndex = index !== -1 ? index + 1 : 0;
    }
  }
}
