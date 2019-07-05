import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';
import { DataService } from './examples/data.service';
import { ExamplesModule } from './examples/examples.module';
import { LayoutHeaderComponent } from './layout/header.component';
import { LayoutSidenavComponent } from './layout/sidenav-component';
import { appRoutes } from './routes';
import { ExampleHostDirective, ExampleViewerComponent } from './shared/example-viewer/example-viewer.component';
import { StackblitzButtonComponent } from './shared/example-viewer/stackblitz-button/stackblitz-button.component';
import { RouteViewerComponent } from './shared/route-viewer/route-viewer.component';

@NgModule({
    imports: [
        BrowserModule,
        NgSelectModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ExamplesModule,
        NgbModule,
        RouterModule.forRoot(
            appRoutes,
            {
                useHash: true
            }
        )
    ],
    providers: [
        DataService,
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
    entryComponents: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}

