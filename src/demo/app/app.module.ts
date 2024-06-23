import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { DataService } from './examples/data.service';
import { ExamplesModule } from './examples/examples.module';
import { LayoutHeaderComponent } from './layout/header.component';
import { LayoutSidenavComponent } from './layout/sidenav-component';
import { appRoutes } from './routes';
import { ExampleHostDirective, ExampleViewerComponent } from './shared/example-viewer/example-viewer.component';
import { StackblitzButtonComponent } from './shared/example-viewer/stackblitz-button/stackblitz-button.component';
import { RouteViewerComponent } from './shared/route-viewer/route-viewer.component';
import {APP_BASE_HREF} from '@angular/common';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        ExamplesModule,
        NgbModule,
        RouterModule.forRoot(appRoutes, {
    useHash: true
})
    ],
    providers: [
        DataService,
       // {provide: APP_BASE_HREF, useValue: '/ng-select/'}
    ],
    declarations: [
        ExampleHostDirective,
        AppComponent,
        LayoutHeaderComponent,
        LayoutSidenavComponent,
        ExampleViewerComponent,
        StackblitzButtonComponent,
        RouteViewerComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

