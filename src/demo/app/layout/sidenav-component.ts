import { Component } from '@angular/core';

@Component({
    selector: 'layout-sidenav',
    template: `
        <ul class="nav flex-column">
            <li class="nav-item">
                <a class="nav-link" routerLink="/forms" routerLinkActive="active">Real life example</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" routerLink="/filter" routerLinkActive="active">Filter and autocomplete</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" routerLink="/tags" routerLinkActive="active">Tags</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" routerLink="/multiselect" routerLinkActive="active">Multiselect</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" routerLink="/bindings" routerLinkActive="active">Data bindings</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" routerLink="/templates" routerLinkActive="active">Templates</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" routerLink="/events" routerLinkActive="active">Output events</a>
            </li>
        </ul>
    `
})
export class LayoutSidenavComponent {
}


