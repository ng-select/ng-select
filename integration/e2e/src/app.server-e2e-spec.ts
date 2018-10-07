import { browser, by } from 'protractor';

describe('ng-select:universal', () => {
    beforeEach(() => {
        browser.driver.get(browser.baseUrl + '/');
    });

    it('should not have null value', async() => {
        const input = await browser.driver.findElement(by.css('.ng-input input'));
        const value = await input.getAttribute('value');
        expect(value).not.toEqual('null');
    });
});
