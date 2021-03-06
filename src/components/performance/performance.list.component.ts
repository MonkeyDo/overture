import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { Globals } from '../../app.globals';
import { PerformanceService } from './performance.service';

@Component({
  moduleId: module.id,
  templateUrl: './performance.list.template.html',
  styleUrls: ['./performance.styl'],
  providers: [PerformanceService]
})

export class PerformanceListComponent {
  @Input() expressionURI: string;

  items: any[];
  filter = {};
  querying: boolean = false;
  error: boolean = false;

  scrollInProgress = false;
  disableScroll: boolean = false;

  constructor(
    private _performanceService: PerformanceService,
    private router: Router, private globals: Globals, private route: ActivatedRoute) {
    this.globals = globals;
  }

  ngOnInit() {
    this.filter = this.route.queryParams['value'];
    this.getList();

    this.router.events
      .map(event => event instanceof NavigationStart)
      .subscribe(() => {
        let newFilter = this.route.queryParams['value'];
        if (JSON.stringify(newFilter) != JSON.stringify(this.filter)) {
          this.filter = newFilter;
          this.getList();
        }
      }, (err) => {
        this.error = true;
        console.error(err);
      });
  }

  getList() {
    // if (this.querying) return false;
    this.querying = true;
    this.error = false;

    this._performanceService.query(this.filter).subscribe(
      res => {
        this.items = res['@graph'];
        this.querying = false;
      },
      error => {
        console.error('Error: ' + error);
        this.querying = false;
        this.error = true;
      }
    );
  }

  onFilterChanged(filter = {}) {
    this.disableScroll = false;

    this.router.navigate(['/performance'], {
      queryParams: filter
    });
  }

  onScroll() {
    if (this.disableScroll || this.scrollInProgress || !this.items) return;
    this.scrollInProgress = true;

    this._performanceService.query(this.filter, this.items.length)
      .subscribe(res => {
        this.scrollInProgress = false;
        let list = res['@graph'];
        if (!list.length) this.disableScroll = true;
        this.items.push(...list);
      }, error => console.error('Error: ' + error));
  }

  myIdChange(event) {
    this.expressionURI = '<' + event.value + '>';
    this.ngOnInit();
    window.scrollTo(0, 0);
  }

  wip() {
    this.router.navigate(['/wip']);
  }
}
