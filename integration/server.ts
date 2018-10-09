import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { enableProdMode } from '@angular/core';
import * as express from 'express';
import { join } from 'path';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { AppServerModuleNgFactory, LAZY_MODULE_MAP } from './dist/integration-server/main';

enableProdMode();

const app = express();
const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        provideModuleMap(LAZY_MODULE_MAP),
    ],
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'integration'));
app.get('*.*', express.static(join(DIST_FOLDER, 'integration')));
app.get('*', (req, res) => {
    res.render('index', {req});
});
app.listen(PORT, () => {
    console.log(`Node server listening on http://localhost:${PORT}`);
});
