import { TestBed } from '@angular/core/testing';
import { VirtualScrollService } from './virtual-scroll.service';

describe('VirtualScrollService', () => {

    let service: VirtualScrollService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [VirtualScrollService]
        });

        service = TestBed.get(VirtualScrollService);
    });

    describe('calculate items', () => {
        it('should calculate items from beginning', () => {
            const itemsLength = 100;
            const buffer = 4;

            service.setDimensions(25, 100);
            const res = service.calculateItems(0, itemsLength, buffer);

            expect(res).toEqual({
                start: 0,
                end: 9,
                topPadding: 0,
                scrollHeight: 2500
            })
        });

        it('should calculate items when scrolled', () => {
            const itemsLength = 100;
            const buffer = 4;

            service.setDimensions(25, 100);
            const res = service.calculateItems(1250, itemsLength, buffer);

            expect(res).toEqual({
                start: 46,
                end: 59,
                topPadding: 1150,
                scrollHeight: 2500
            })
        });
    });
})
;
