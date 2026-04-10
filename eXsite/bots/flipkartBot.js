import { chromium } from 'playwright';
import { delay } from '../utils/delay.js';
import fs from 'fs';
import path from 'path';

const AUTH_PATH = path.resolve('auth.json');

async function waitForSignIn(page, context) {
    // Check if Flipkart is asking for sign-in
    const signInIndicators = [
        'input[type="text"][autocomplete="off"]',  // phone/email field
        'button:has-text("Request OTP")',
        'button:has-text("Login")',
        'form._2Tgsjp',
        'span:has-text("Login or Signup")',
    ];

    let needsSignIn = false;
    for (const sel of signInIndicators) {
        try {
            if (await page.locator(sel).first().isVisible({ timeout: 1500 })) {
                needsSignIn = true;
                break;
            }
        } catch { /* not visible */ }
    }

    if (needsSignIn) {
        console.log("🔐 Flipkart sign-in page detected. Please sign in manually in the browser...");
        console.log("   (The bot will automatically continue once you're signed in)");

        // Wait until the sign-in form disappears
        let signedIn = false;
        while (!signedIn) {
            await delay(3000);
            try {
                const url = page.url();
                if (!url.includes('/account/login') && !url.includes('login')) {
                    signedIn = true;
                }
                // Check if the OTP/Login form is gone
                const otpBtn = page.locator('button:has-text("Request OTP")');
                if (!(await otpBtn.isVisible({ timeout: 500 }))) {
                    signedIn = true;
                }
            } catch {
                signedIn = true;
            }
        }

        console.log("✅ Sign-in completed! Saving session...");
        await context.storageState({ path: AUTH_PATH });
        console.log("💾 auth.json saved — you won't need to sign in again.");
        await delay(2000);
    }
}

export async function runFlipkartBot(product) {
    const browser = await chromium.launch({ headless: false });

    // Only load storageState if auth.json actually exists
    const contextOptions = fs.existsSync(AUTH_PATH) ? { storageState: AUTH_PATH } : {};
    const context = await browser.newContext(contextOptions);

    const page = await context.newPage();

    try {
        console.log(`🛒 Flipkart Bot: Navigating to ${product.url}`);
        await page.goto(product.url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Wait for page to render
        await delay(4000);

        // Close any login popup that appears
        try {
            const closeBtn = page.locator('button._2KpZ6l._2doB4z');
            if (await closeBtn.isVisible({ timeout: 2000 })) {
                await closeBtn.click();
                await delay(500);
            }
        } catch {
            // No popup
        }

        // Check if Flipkart requires sign-in
        await waitForSignIn(page, context);

        let activePage = page;

        // Check if this is a search results page (fallback URL)
        const isSearchPage = product.url.includes('/search?q=');
        
        if (isSearchPage) {
            console.log("📋 Search results page detected — clicking first result...");
            
            const firstResult = activePage.locator('a._1fQZEK, a.s1Q9rs, div._2kHMtA a, a._2rpwqI').first();
            if (await firstResult.isVisible({ timeout: 5000 })) {
                try {
                    const [newPage] = await Promise.all([
                        context.waitForEvent('page', { timeout: 5000 }),
                        firstResult.click()
                    ]);
                    await newPage.waitForLoadState('domcontentloaded');
                    activePage = newPage;
                    console.log("✅ Switched to new tab for Flipkart product page");
                } catch (e) {
                    console.log("ℹ Product opened in same tab");
                }
                await delay(3000);
            } else {
                console.log("⚠ No search results found");
                return { success: false, message: "No search results found on Flipkart" };
            }
        }

        // Try multiple selectors for the Buy Now button
        const buyNowSelectors = [
            'button:has-text("BUY NOW")',
            'button:has-text("Buy Now")',
            'button._2KpZ6l._2U9uOA._3v1-ww',
            'button.QqFHMw.twnNGM._6MBMsq',
            'button.QqFHMw._3v1-ww',
        ];

        let clicked = false;
        for (const selector of buyNowSelectors) {
            try {
                const btn = activePage.locator(selector).first();
                await btn.waitFor({ state: 'visible', timeout: 3000 });
                await delay(500);
                await btn.click({ timeout: 3000 });
                clicked = true;
                console.log(`✅ Clicked Buy Now via: ${selector}`);
                break;
            } catch {
                continue;
            }
        }

        if (!clicked) {
            // Fallback: Add to Cart
            console.log("⚠ Buy Now not found, trying Add to Cart...");
            const addToCartSelectors = [
                'button:has-text("ADD TO CART")',
                'button:has-text("Add to Cart")',
                'button._2KpZ6l._2U9uOA.ihZ75k._3AWRsL',
            ];

            for (const selector of addToCartSelectors) {
                try {
                    const btn = activePage.locator(selector).first();
                    await btn.waitFor({ state: 'visible', timeout: 3000 });
                    await delay(500);
                    await btn.click({ timeout: 3000 });
                    clicked = true;
                    console.log(`✅ Added to cart via: ${selector}`);
                    break;
                } catch {
                    continue;
                }
            }
        }

        if (!clicked) {
            console.log("❌ Could not find Buy Now or Add to Cart button");
            return { success: false, message: "Could not find Buy Now or Add to Cart button" };
        }

        await delay(3000);

        // After clicking Buy Now, Flipkart may redirect to sign-in
        await waitForSignIn(activePage, context);

        const checkoutUrl = activePage.url();
        console.log(`🎯 Reached: ${checkoutUrl}`);
        console.log(`✅ Flipkart checkout reached for: ${product.name}`);

        console.log("👉 Browser will stay open. Complete payment manually, then close the window.");

        // Keep script alive and periodically save cookies until the user closes the window
        while (!activePage.isClosed()) {
            try {
                await context.storageState({ path: AUTH_PATH });
                await delay(5000);
            } catch (e) {
                break;
            }
        }

        console.log("✅ Browser closed by user.");

        return { 
            success: true,
            message: `Checkout reached at: ${checkoutUrl}`,
            checkout_url: checkoutUrl
        };

    } catch (err) {
        console.error(`❌ Flipkart Bot Error: ${err.message}`);
        return { success: false, message: err.message };
    }
    // NOTE: Not closing browser — user completes payment manually
}