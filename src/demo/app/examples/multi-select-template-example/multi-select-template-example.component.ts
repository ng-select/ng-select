import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

@Component({
    selector: 'multi-select-template-example',
    templateUrl: './multi-select-template-example.component.html',
    styleUrls: ['./multi-select-template-example.component.scss']
})
export class MultiSelectTemplateExampleComponent implements OnInit {

    githubUsers$: Observable<any[]>;
    selectedUsers = ['anjmao'];

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        this.githubUsers$ = this.dataService.getGithubAccounts('anjm');
    }
}
