import { browser, by, element, ElementFinder } from 'protractor';

describe('ng-select', () => {

  let select: ElementFinder;

  beforeEach(() => {
    browser.get('/');
    select = element(by.tagName('ng-select'));
  });

  it('should be rendered', () => {
    expect(select).toBeDefined();
  });

  it('should open dropdown on click', () => {
    select.element(by.css('.as-control')).click();

    expect(select.getAttribute('class')).toMatch('opened');
  });

  it('should select value and close dropdown', () => {
    select.element(by.css('.as-control')).click();

    select.all(by.css('.as-option')).first().click();

    expect(select.getAttribute('class')).not.toMatch('opened');
    expect(element(by.id('ngModel')).getText()).toBe('{ "id": 1, "name": "Vilnius", "selected": true, "marked": false }');
  });


});
