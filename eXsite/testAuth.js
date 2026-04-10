import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: false });

    const context = await browser.newContext({
        storageState: 'auth.json'
    });

    const page = await context.newPage();

    await page.goto('https://www.amazon.in');

    console.log("Check if you're already logged in 👀");

})();