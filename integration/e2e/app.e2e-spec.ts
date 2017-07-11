import { browser, element, by } from 'protractor';

describe('AngSelect Lib E2E Tests', function () {

  beforeEach(() => browser.get(''));

  afterEach(() => {
    browser.manage().logs().get('browser').then((browserLog: any[]) => {
      expect(browserLog).toEqual([]);
    });
  });

  it('should display lib', () => {
    expect(element(by.css('h2')).getText()).toEqual('Hello ang-select');
  });

});
