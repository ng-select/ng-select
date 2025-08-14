import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { KeyCode } from 'src/ng-select/lib/ng-select.types';
import { DataService } from '../data.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'ng-accessibility-custom-multi-select-example',
    templateUrl: './accessibility-custom-multi-select-example.component.html',
    styleUrls: ['./accessibility-custom-multi-select-example.component.scss'],
    imports: [NgSelectComponent, FormsModule, AsyncPipe]
})
export class AccessibilityCustomMultiSelectExampleComponent implements OnInit {

  githubUsers$: Observable<any[]>;
  selectedUsers = ['anjmao', 'anjmittu', 'anjmendoza'];
  removeTranslated = 'Remove';

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
      this.githubUsers$ = this.dataService.getGithubAccounts('anjm');
  }

  // Custom function for keyboard interaction
  triggerClick(event, element: HTMLElement): void {
      const isClick =
      ['Enter', 'Space'].includes(event.code) || [KeyCode.Enter, KeyCode.Space].includes(event.keyCode);

      if (isClick) {
          element.click();
          event.preventDefault();
          event.stopPropagation();
      }
  }

}
