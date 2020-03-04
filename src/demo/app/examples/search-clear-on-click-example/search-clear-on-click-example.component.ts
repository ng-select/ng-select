import { Component, OnInit } from '@angular/core';
import { Person, DataService } from '../data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search-clear-on-click-example',
  templateUrl: './search-clear-on-click-example.component.html'
})
export class SearchClearOnClickExampleComponent implements OnInit {

  people$: Observable<Person[]>;
  selectedPersonId = '5a15b13c36e7a7f00cf0d7cb';

  constructor(
    private dataService: DataService) {
  }

  ngOnInit() {
    this.people$ = this.dataService.getPeople();
  }

}
