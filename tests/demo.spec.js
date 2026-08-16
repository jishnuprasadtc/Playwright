import {test,expect} from '@playwright/test';  //Need include in single " @playwright/test"

test('my first demo test',async({page}) => {

    await page.goto('https://trello.com/home')
    await expect(page).toHaveTitle('Capture, organize, and tackle your to-dos from anywhere')

})