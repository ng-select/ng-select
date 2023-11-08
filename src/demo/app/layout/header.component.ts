import { Component, EventEmitter, Input, Output } from '@angular/core';

type langDir = 'ltr' | 'rtl';
type theme = 'default' | 'ant' | 'material';

@Component({
    selector: 'layout-header',
    template: `
        <nav class="navbar navbar-expand flex-column flex-md-row bd-navbar">
            <a class="navbar-brand" href="#">
                <img src="https://angular.io/assets/images/logos/angular/angular.svg" width="32px" height="32px"/>
                &#64;ng-select/ng-select
            </a>
            <button class="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarsExampleDefault"
                    aria-controls="navbarsExampleDefault"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse">
                <div ngbDropdown class="d-inline-block">
                    <button class="btn btn-outline-secondary btn-sm" style="width: 150px;"
                            ngbDropdownToggle>{{theme}}</button>
                    <div ngbDropdownMenu>
                        <button (click)="setTheme('default')" class="dropdown-item btn-sm">Default theme</button>
                        <button (click)="setTheme('material')" class="dropdown-item btn-sm">Material theme
                        </button>
                        <button (click)="setTheme('ant')" class="dropdown-item btn-sm">Ant Design theme
                        </button>
                    </div>
                </div>

                <div ngbDropdown class="d-inline-block ml-2">
                    <button class="btn btn-outline-secondary btn-sm text-uppercase" style="width: 60px;"
                            ngbDropdownToggle>{{dir}}</button>
                    <div ngbDropdownMenu>
                        <button (click)="changeDirTo('ltr')" class="dropdown-item btn-sm text-uppercase">ltr</button>
                        <button (click)="changeDirTo('rtl')" class="dropdown-item btn-sm text-uppercase">rtl</button>
                    </div>
                </div>

                <ul class="navbar-nav mr-auto">
                </ul>

                <form class="form-inline my-2 my-lg-0">
                    <a class="github-button"
                       href="https://github.com/ng-select/ng-select"
                       data-icon="mark-github"
                       data-size="large"
                       data-show-count="true"
                       aria-label="Visit ng-select/ng-select on GitHub">Github</a>
                </form>
            </div>
        </nav>
    `
})
export class LayoutHeaderComponent {
    @Input() dir: langDir;
    @Input() theme = 'default';
    @Input() version: string;
    @Output() dirChange = new EventEmitter<langDir>();
    @Output() themeChange = new EventEmitter<theme>();

    setTheme(theme: theme) {
        this.theme = theme;
        this.themeChange.emit(theme);
    }

    changeDirTo(dir: langDir) {
        this.dir = dir;
        this.dirChange.emit(dir);
    }
}


