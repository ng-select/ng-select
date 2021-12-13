import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { KeyCode } from 'src/ng-select/lib/ng-select.types';
import { DataService } from '../data.service';

@Component({
    selector: 'multi-select-template-example',
    templateUrl: './multi-select-template-example.component.html',
    styleUrls: ['./multi-select-template-example.component.scss']
})
export class MultiSelectTemplateExampleComponent implements OnInit {

    githubUsers$: Observable<any[]>;
    selectedUsers = ['anjmao'];
    removeTranslated = 'Remove';

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        this.githubUsers$ = this.dataService.getGithubAccounts('anjm');
    }

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
