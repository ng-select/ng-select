import { Component, EventEmitter } from '@angular/core';

@Component({
    selector: 'layout-header',
    template: `
    <nav class="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
        <a class="navbar-brand" href="#">
            <img src="https://angular.io/assets/images/logos/angular/angular.svg" width="32px" height="32px" />
            @ng-select/ng-select
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse"  aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarsExampleDefault">
        <ul class="navbar-nav mr-auto">
            <!--<li class="nav-item active">
            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
            </li>
            <li class="nav-item">
            <a class="nav-link disabled" href="#">Disabled</a>
            </li>
            <li class="nav-item dropdown">
            <div class="dropdown-menu" aria-labelledby="dropdown01">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <a class="dropdown-item" href="#">Something else here</a>
            </div>
            </li>-->
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
}


