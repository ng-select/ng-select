import { EnvironmentProviders, Provider, makeEnvironmentProviders } from '@angular/core';
import { SELECTION_MODEL_FACTORY } from './ng-select.component';
import { DefaultSelectionModelFactory, SelectionModelFactory } from './selection-model';

/**
 * @description
 * Provides the `SELECTION_MODEL_FACTORY` token with the given factory.
 *
 * @param customSelectionModelFactory The model to configure selection factory.
 * @returns The environment providers.
 *
 * @example
 * ```ts
 * import { provideCustomSelectionModelFactory } from 'ngx-toastr';
 *
 * export function CustomSelectionFactory() {
 *   return new CustomSelectionModel();
 * }
 * export class CustomSelectionModel implements SelectionModel {
 *    ...
 * }
 * bootstrap(AppComponent, {
 *   providers: [
 *     provideCustomSelectionModelFactory(<SelectionModelFactory>CustomSelectionFactory),
 *   ],
 * })
 */
export const provideCustomSelectionModelFactory = (customSelectionModelFactory: SelectionModelFactory = null): EnvironmentProviders => {
    const providers: Provider[] = [
        {
            provide: SELECTION_MODEL_FACTORY,
            useValue: customSelectionModelFactory ? customSelectionModelFactory : DefaultSelectionModelFactory,
        }
    ];

    return makeEnvironmentProviders(providers);
};
