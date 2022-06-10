import { Component, Injectable, OnInit } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExampleBackendService {
    addTag(name: string) {
        return new Promise((resolve) => {
            // Simulate backend call.
            setTimeout(() => {
                resolve({ id: 5, name, valid: true });
            }, 1000);
        });
    }
}

@Component({
    selector: 'tags-backend-example',
    templateUrl: './tags-backend-example.component.html',
    styleUrls: ['./tags-backend-example.component.scss'],
})
export class TagsBackendExampleComponent implements OnInit {
    selectedCompanies;
    companies: any[] = [];
    loading = false;
    companiesNames = ['Uber', 'Microsoft', 'Flexigen'];

    // function passed to [addTag] needs to have 'this' hard bound
    // otherwise it will silently fail
    hardBoundAddTagPromiseFunction = this.addTagPromise.bind(this);
    // this would also work
    // hardBoundAddTagPromiseFunction = (name: string) => this.addTagPromise(name);

    constructor(private backendService: ExampleBackendService) {}

    ngOnInit() {
        this.companiesNames.forEach((c, i) => {
            this.companies.push({ id: i, name: c });
        });
    }

    async addTagPromise(name) {
        this.loading = true;
        const result = await this.backendService.addTag(name);
        this.loading = false;

        return result;
    }
}
