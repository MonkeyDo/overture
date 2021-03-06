import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VocabularyService } from './vocabulary.service';
import { Globals } from '../../app.globals';
import { ActivatedRoute } from '@angular/router';
import { Observable } from "rxjs/Rx";

@Component({
  moduleId: module.id,
  selector: 'search-comp',
  templateUrl: './search.template.html',
  styleUrls: ['./search.styl'],
  providers: [VocabularyService, Globals]
})
export class SearchComponent {
  @Input() context: string = 'expression';
  @Output() onFilterChanged = new EventEmitter();
  filter = {
    mop: [],
    genre: null,
    key: null,
    title: null,
    composer: null,
    year: null
  };

  itemsKey: Observable<Array<any>>;
  itemsGenre: Observable<Array<any>>;
  itemsMop: Observable<Array<any>>;

  constructor(private _vocabularyService: VocabularyService, private globals: Globals, private route: ActivatedRoute) {
    this.itemsKey = this._vocabularyService.get('key');
    this.itemsGenre = this._vocabularyService.get('genre');
    this.itemsMop = this._vocabularyService.get('mop');
  }

  ngOnInit() {
    this._loadFilter();
  }

  private _loadFilter() {
    let params = this.route.queryParams['value'];
    Object.keys(params).forEach(p => {
      let v = params[p];
      console.log(p, v);

      if (Array.isArray(this.filter[p])) {
        if (Array.isArray(v))
          this.filter[p].push(...v)
        else this.filter[p].push(v)
      }
      else this.filter[p] = v
    });
  }

  emptyFilter(f: string) {
    this.filter[f] = Array.isArray(this.filter[f]) ? [] : null;
    this.changeFilter(null);
  }

  changeFilter(_event: any) {
    if (this.filter.year && !this.filter.year.match(/\d{4}/)) return;
    debounce(() => {
      this.onFilterChanged.emit(this.filter);
    }, 500)();
  }

  toBeShown(x: string) {
    switch (x) {
      case 'title':
      case 'composer':
      case 'key':
      case 'mop':
      case 'genre':
        return this.context == 'expression';
      case 'year':
      case 'place':
        return this.context == 'performance';
      default: return false;
    }
  }
}

// https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait = 0, immediate = false) {
  var timeout;
  return function() {
    let context = this, args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
