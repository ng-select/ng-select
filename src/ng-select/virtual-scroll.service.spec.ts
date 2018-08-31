import { inject, TestBed } from '@angular/core/testing';

import { VirtualScrollService } from './virtual-scroll.service';

describe('VirtualScrollService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [VirtualScrollService]
        });
    });

    it('should calculate items', inject([VirtualScrollService], (service: VirtualScrollService) => {
        const dropdown = document.createElement('div');
        dropdown.style.width = '120px';
        dropdown.style.height = '100px';
        document.body.appendChild(dropdown);

        const content = document.createElement('div');
        content.innerHTML = `<div class="ng-option" style="width: 120px; height: 25px;"></div>`;
        document.body.appendChild(content);

        const itemsLength = 100;
        const buffer = 4;
        const d = service.calculateDimensions(itemsLength, 0, dropdown, content);
        const res = service.calculateItems(d, dropdown, buffer);

        expect(res).toEqual({
            start: 0,
            end: 9,
            topPadding: 0,
            scrollHeight: 2500
        })
    }))

    it('should calculate dimensions', inject([VirtualScrollService], (service: VirtualScrollService) => {
        const dropdown = document.createElement('div');
        dropdown.style.width = '120px';
        dropdown.style.height = '100px';
        document.body.appendChild(dropdown);

        const content = document.createElement('div');
        content.innerHTML = `<div class="ng-option" style="width: 120px; height: 25px;"></div>`;
        document.body.appendChild(content);

        const itemsLength = 100;
        const res = service.calculateDimensions(itemsLength, 0, dropdown, content);

        expect(res).toEqual({
            itemsLength: itemsLength,
            viewWidth: 120,
            viewHeight: 100,
            childWidth: 120,
            childHeight: 25,
            itemsPerCol: 4
        })
    }));
});
