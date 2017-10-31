import { Component } from '@angular/core';

@Component({
    selector: 'layout-sidenav',
    template: `
        <ul class="nav flex-column">
            <li class="nav-item" routerLinkActive="active">
                <a class="nav-link" routerLink="/forms">Reactive forms</a>
            </li>
            <li class="nav-item" routerLinkActive="active">
                <a class="nav-link" routerLink="/filter">Filter and autocomplete</a>
            </li>
            <li class="nav-item" routerLinkActive="active">
                <a class="nav-link" routerLink="/tags">Tags</a>
            </li>
            <li class="nav-item" routerLinkActive="active">
                <a class="nav-link" routerLink="/multiselect">Multiselect</a>
            </li>
            <li class="nav-item" routerLinkActive="active">
                <a class="nav-link" routerLink="/bindings" routerLinkActive="active">Data bindings</a>
            </li>
            <li class="nav-item" routerLinkActive="active">
                <a class="nav-link" routerLink="/templates">Templates</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" routerLink="/events">Output events</a>
            </li>
        </ul>
    `
})
export class LayoutSidenavComponent {
}


