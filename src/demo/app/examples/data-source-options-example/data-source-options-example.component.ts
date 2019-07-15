import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'data-source-options-example',
    templateUrl: './data-source-options-example.component.html',
    styleUrls: ['./data-source-options-example.component.scss']
})
export class DataSourceOptionsExampleComponent implements OnInit {

    selectedCars = [3];
    cars = [
        { id: 1, name: 'Volvo' },
        { id: 2, name: 'Saab', disabled: true },
        { id: 3, name: 'Opel' },
        { id: 4, name: 'Audi' },
    ];

    ngOnInit() {

    }

    toggleDisabled() {
        const car: any = this.cars[1];
        car.disabled = !car.disabled;
    }
}
