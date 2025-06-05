import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import sdk, { Project } from '@stackblitz/sdk';

const EXAMPLE_PATH = '/ng-select/examples/';
const TEMPLATE_PATH = '/ng-select/assets/stackblitz/';

// Updated template files for standalone setup
const TEMPLATE_FILES = ['index.html', 'styles.css', 'polyfills.ts', 'data.service.ts', 'main.ts', 'app.component.ts', 'angular.json'];

const angularVersion = '>=20.0.0';
const dependencies = {
	'@angular/animations': angularVersion,
	'@angular/common': angularVersion,
	'@angular/compiler': angularVersion,
	'@angular/core': angularVersion,
	'@angular/forms': angularVersion,
	'@angular/platform-browser': angularVersion,
	'@angular/platform-browser-dynamic': angularVersion,
	'@angular/router': angularVersion,
	'@angular/localize': angularVersion,
	'@ng-select/ng-select': '*',
	'@ng-select/ng-option-highlight': '*',
	'@ng-bootstrap/ng-bootstrap': '*',
	rxjs: '^7.8.0',
	'zone.js': '^0.15.1',
};

@Injectable({
	providedIn: 'root',
})
export class StackblitzService {
	private _exampleName: string;
	private _componentName: string;
	private _examplePath: string;

	constructor(private _http: HttpClient) {}

	private get _exampleImport() {
		return `import { ${this._componentName} } from './src/${this._exampleName}.component'`;
	}

	private get _bootstrapComponent() {
		return `
    bootstrapApplication(AppComponent, {
      providers: [
        importProvidersFrom(NgbModule),
        provideHttpClient()
      ]
    }).catch(err => console.error(err));`;
	}

	async openNewProject(example: string) {
		this._mapExamplePath(example);

		const exampleFiles = await this.fetchExampleFiles();
		const templateFiles = await this.fetchTemplateFiles();

		const project: Project = {
			files: {
				...templateFiles,
				...exampleFiles,
			},
			title: 'ng-select example',
			description: 'ng-select example',
			template: 'angular-cli',
			dependencies: dependencies,
		};

		sdk.openProject(project, { openFile: `src/${this._exampleName}.component.html` });
	}

	async fetchTemplateFiles() {
		const files: { [path: string]: string } = {};
		for (const file of TEMPLATE_FILES) {
			let fileResult = await this._readFile(file, TEMPLATE_PATH);
			if (file.includes('app.component')) {
				fileResult = fileResult.replace('//example-import', this._exampleImport);
				fileResult = fileResult.replace('//bootstrap', this._bootstrapComponent);
			}
			files[file] = fileResult;
		}
		return files;
	}

	async fetchExampleFiles() {
		const exampleFiles = ['html', 'scss', 'ts'].map((ex) => `${this._exampleName}.component.${ex}`);
		const files: { [path: string]: string } = {};

		for (const file of exampleFiles) {
			const path = `src/${file}`;
			files[path] = await this._readFile(file, this._examplePath);
		}

		return files;
	}

	private async _readFile(file: string, path: string) {
		return await this._http.get(path + file, { responseType: 'text' }).toPromise();
	}

	private _mapExamplePath(example: string) {
		const toUpperCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

		this._exampleName = example;
		this._examplePath = EXAMPLE_PATH + example + '/';
		this._componentName = `${this._exampleName
			.split('-')
			.map((x) => toUpperCase(x))
			.join('')}Component`;
	}
}
