import { browser, element, by } from 'protractor';

describe('QuickStart Lib E2E Tests', function () {

  beforeEach(() => browser.get(''));

  afterEach(() => {
    browser.manage().logs().get('browser').then((browserLog: any[]) => {
      expect(browserLog).toEqual([]);
    });
  });

  it('should display lib', () => {
    expect(element(by.css('h2')).getText()).toEqual('Hello Angular Library');
  });

  it('should display meaning', () => {
    expect(element(by.css('h3')).getText()).toEqual('Meaning is: 42');
  });

});
