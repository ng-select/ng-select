import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'forms-single-select-option-null-example',
  templateUrl: './forms-single-select-option-null-example.component.html',
  styleUrls: ['./forms-single-select-option-null-example.component.scss'],
})
export class FormsSingleSelectOptionNullExampleComponent {

  heroForm1 = this.fb.group({
    age: ['', Validators.required],
  });
  heroForm2 = this.fb.group({
    age: ['', Validators.required],
  });
  heroForm3 = this.fb.group({
    age: [[''], Validators.required],
  });
  heroForm4 = this.fb.group({
    age: [[''], Validators.required],
  });

  ages: any[] = [
    // { value: null, label: 'All' },
    { value: '<18', label: 'Under 18' },
    { value: '18', label: '18' },
    { value: '>18', label: 'More than 18' },
  ];

  agesWithoutNull: any[] = [
    { value: '<18', label: 'Under 18' },
    { value: '18', label: '18' },
    { value: '>18', label: 'More than 18' },
  ];

  constructor(private fb: FormBuilder) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.heroForm1.controls.age.setValue(null);
      this.heroForm2.controls.age.setValue(null);
      this.heroForm3.controls.age.setValue([null]);
      this.heroForm4.controls.age.setValue([null]);
      // this.ages.push({ value: null, label: 'All' });
      // this.ages = [...this.ages];

      setTimeout(() => {
        this.ages = [
          { value: null, label: 'All' },
          { value: '<18', label: 'Under 18' },
          { value: '18', label: '18' },
          { value: '>18', label: 'More than 18' },
        ];
      }, 3000);
    }, 3000);
  }
}
