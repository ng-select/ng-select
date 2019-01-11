import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
const defaultTheme = require('./../../../src/themes/default.theme.scss');
const materialTheme = require('./../../../src/themes/material.theme.scss');

type langDir = 'ltr' | 'rtl';

@Component({
    selector: 'layout-header',
    template: `
        <nav class="navbar navbar-expand navbar-dark flex-column flex-md-row bd-navbar bg-dark">
            <a class="navbar-brand" href="#">
                <img src="https://angular.io/assets/images/logos/angular/angular.svg" width="32px" height="32px" alt="Angular Logo"/>
                @ng-select/ng-select@{{version}}
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
                    <button class="btn btn-outline-light btn-sm" style="width: 130px;" ngbDropdownToggle>{{theme}}</button>
                    <div ngbDropdownMenu>
                        <button (click)="setTheme('Default theme')" class="dropdown-item btn-sm">Default theme</button>
                        <button (click)="setTheme('Material theme')" class="dropdown-item btn-sm">Material theme</button>
                    </div>
                </div>

                <div ngbDropdown class="d-inline-block ml-2">
                    <button class="btn btn-outline-light btn-sm text-uppercase" style="width: 60px;" ngbDropdownToggle>{{dir}}</button>
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
export class LayoutHeaderComponent implements OnInit {
    theme = 'Default theme';
    @Input() version: string;
    @Input() dir: langDir;
    @Output() dirChange = new EventEmitter<langDir>();

    ngOnInit() {
        defaultTheme.use();
    }

    setTheme(theme) {
        this.theme = theme;
        if (this.theme === 'Default theme') {
            materialTheme.unuse();
            defaultTheme.use();
        } else {
            defaultTheme.unuse();
            materialTheme.use();
        }
    }

    changeDirTo(dir: langDir) {
        this.dir = dir;
        this.dirChange.emit(dir);
    }
}


