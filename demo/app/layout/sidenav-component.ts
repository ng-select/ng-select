import { Component } from '@angular/core';

@Component({
    selector: 'layout-sidenav',
    template: `
        <ul class="nav nav-pills flex-column">
            <li class="nav-item" routerLinkActive="active">
                <a class="nav-link" routerLink="/forms" routerLinkActive="active">Reactive forms</a>
            </li>
            <li class="nav-item" routerLinkActive="active">
                <a class="nav-link" routerLink="/virtual-scroll" routerLinkActive="active">Virtual scroll</a>
            </li>
            <li class="nav-item" routerLinkActive="active">
                <a class="nav-link" routerLink="/filter" routerLinkActive="active">Filter and autocomplete</a>
            </li>
            <li class="nav-item" routerLinkActive="active">
                <a class="nav-link" routerLink="/tags" routerLinkActive="active">Tags</a>
            </li>
            <li class="nav-item" routerLinkActive="active">
                <a class="nav-link" routerLink="/multiselect" routerLinkActive="active">Multiselect</a>
            </li>
            <li class="nav-item" routerLinkActive="active">
                <a class="nav-link" routerLink="/bindings" routerLinkActive="active">Data bindings</a>
            </li>
            <li class="nav-item" routerLinkActive="active">
                <a class="nav-link" routerLink="/templates" routerLinkActive="active">Templates</a>
            </li>
            <li class="nav-item" routerLinkActive="active">
                <a class="nav-link" routerLink="/events" routerLinkActive="active">Output events</a>
            </li>
            <li class="nav-item" routerLinkActive="active">
                <a class="nav-link" routerLink="/dropdown-position">Dropdown position</a>
            </li>
        </ul>
    `
})
export class LayoutSidenavComponent {
}


