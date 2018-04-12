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
    select.element(by.css('.ng-select-container')).click();

    expect(select.getAttribute('class')).toMatch('ng-select-opened');
  });

  it('should select value and close dropdown', async () => {
    select.element(by.css('.ng-select-container')).click();

    select.all(by.css('.ng-option')).first().click();

    expect(select.getAttribute('class')).not.toMatch('ng-select-opened');
    const text = await element(by.id('ngModel')).getText();
    expect(text).toEqual('1');
  });


});
