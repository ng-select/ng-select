import './polyfills';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';

bootstrapApplication(AppComponent, appConfig)
	.then((ref) => {
		if (window['ngRef']) {
			window['ngRef'].destroy();
		}
		window['ngRef'] = ref;
	})
	.catch((err) => console.error('Unable to Boostrap the application. Error:' + err));
