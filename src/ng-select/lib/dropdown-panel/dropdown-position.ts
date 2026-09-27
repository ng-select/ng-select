import { ConnectedPosition, ConnectionPositionPair } from '@angular/cdk/overlay';

import { DropdownPosition } from '../types/ng-select.types';

const DROPDOWN_POSITION_BELOW: ConnectedPosition = { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' };
const DROPDOWN_POSITION_ABOVE: ConnectedPosition = { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' };
const DROPDOWN_POSITION_AFTER: ConnectedPosition = { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' };
const DROPDOWN_POSITION_BEFORE: ConnectedPosition = { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' };

export const DROPDOWN_POSITIONS: Readonly<Record<DropdownPosition, readonly ConnectedPosition[]>> = {
	// 'auto' prefers below and flips above when the panel does not fit the viewport;
	// the fit check measures the rendered overlay, so header/footer templates and
	// item count are accounted for (#2687, #2575)
	auto: [DROPDOWN_POSITION_BELOW, DROPDOWN_POSITION_ABOVE],
	bottom: [DROPDOWN_POSITION_BELOW],
	top: [DROPDOWN_POSITION_ABOVE],
	right: [DROPDOWN_POSITION_AFTER],
	left: [DROPDOWN_POSITION_BEFORE],
};

export const DROPDOWN_CSS_POSITIONS: readonly DropdownPosition[] = ['top', 'right', 'bottom', 'left'];

/**
 * Converts a CDK connection pair into the matching ng-select dropdown position.
 *
 * @param pair - The active CDK overlay connection pair.
 * @returns The corresponding ng-select dropdown position.
 *
 * @since 24.0.5
 */
export function connectionPairToDropdownPosition(pair: ConnectionPositionPair): DropdownPosition {
	if (pair.originY === 'bottom' && pair.overlayY === 'top') {
		return 'bottom';
	}
	if (pair.originY === 'top' && pair.overlayY === 'bottom') {
		return 'top';
	}
	if (pair.originX === 'end' && pair.overlayX === 'start') {
		return 'right';
	}
	if (pair.originX === 'start' && pair.overlayX === 'end') {
		return 'left';
	}
	return 'bottom';
}
