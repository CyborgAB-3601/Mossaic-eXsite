import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const pageAmazon = await context.newPage();
    const pageFlipkart = await context.newPage();

    await pageAmazon.goto('https://www.amazon.in');
    await pageFlipkart.goto('https://www.flipkart.com');

    console.log("👉 Login manually on both tabs (Amazon & Flipkart), then press ENTER in this terminal...");

    process.stdin.once('data', async () => {
        await context.storageState({ path: 'auth.json' });
        console.log("✅ auth.json saved correctly! Your logins are now persistent.");
        await browser.close();
        process.exit();
    });
})();