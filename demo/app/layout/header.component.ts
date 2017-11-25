import { Component, Input} from '@angular/core';

@Component({
    selector: 'layout-header',
    template: `
        <nav class="navbar navbar-expand navbar-dark flex-column flex-md-row bd-navbar bg-dark">
            <a class="navbar-brand" href="#">
                <img src="https://angular.io/assets/images/logos/angular/angular.svg" width="32px" height="32px"/>
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

            <div class="collapse navbar-collapse" id="navbarsExampleDefault">
                <ul class="navbar-nav mr-auto">
                </ul>
                <form class="form-inline my-2 my-lg-0">
                    <!-- Place this tag where you want the button to render. -->
                    <a class="github-button"
                       href="https://github.com/ng-select/ng-select"
                       data-icon="octicon-star"
                       data-size="large"
                       data-show-count="true"
                       aria-label="Star ng-select/ng-select on GitHub">Star</a>
                </form>
            </div>
        </nav>
    `
})
export class LayoutHeaderComponent {
    @Input() version: string;
}


