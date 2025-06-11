import './polyfills';
import { AppComponent } from './app.module';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';

bootstrapApplication(AppComponent, appConfig)
	.then((ref) => {
		if (window['ngRef']) {
			window['ngRef'].destroy();
		}
		window['ngRef'] = ref;
	})
	.catch((err) => console.error(err));
