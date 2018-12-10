import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

if (environment.manualBootstrap) {
  window['doBootstrap'] = () => {
      platformBrowserDynamic().bootstrapModule(AppModule);
  };
} else {
  platformBrowserDynamic().bootstrapModule(AppModule);
}
