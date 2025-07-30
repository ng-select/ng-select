import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NgHeaderTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-virtual-scroll-example',
	templateUrl: './virtual-scroll-example.component.html',
	styleUrls: ['./virtual-scroll-example.component.scss'],
	imports: [NgSelectComponent, NgHeaderTemplateDirective, NgOptionTemplateDirective],
})
export class VirtualScrollExampleComponent implements OnInit {
	private http = inject(HttpClient);

	photos = [];
	photosBuffer = [];
	bufferSize = 50;
	numberOfItemsFromEndBeforeFetchingMore = 10;
	loading = false;

	testItems = [
		{ value: 1, label: 'Very Long Option Text That Should Expand The Dropdown Width' },
		{ value: 2, label: 'Another Very Long Option Text Example For Testing' },
		{ value: 3, label: 'Short text' },
		{ value: 4, label: 'Medium length option text' },
		{ value: 5, label: 'Super Ultra Long Option Text That Definitely Should Expand The Dropdown Beyond The Container Width' },
		{ value: 6, label: 'Watson is a question-answering computer system' },
		{ value: 7, label: 'Sherlock Holmes is a fictional detective' },
		{ value: 8, label: 'Another long item with descriptive text' }
	];

	ngOnInit() {
		this.http.get<any[]>('https://jsonplaceholder.typicode.com/photos').subscribe((photos) => {
			this.photos = photos;
			this.photosBuffer = this.photos.slice(0, this.bufferSize);
		});
	}

	onScrollToEnd() {
		this.fetchMore();
	}

	onScroll({ end }) {
		if (this.loading || this.photos.length <= this.photosBuffer.length) {
			return;
		}

		if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.photosBuffer.length) {
			this.fetchMore();
		}
	}

	private fetchMore() {
		const len = this.photosBuffer.length;
		const more = this.photos.slice(len, this.bufferSize + len);
		this.loading = true;
		// using timeout here to simulate backend API delay
		setTimeout(() => {
			this.loading = false;
			this.photosBuffer = this.photosBuffer.concat(more);
		}, 200);
	}
}
