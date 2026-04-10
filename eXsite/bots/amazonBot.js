import { chromium } from 'playwright';
import { delay } from '../utils/delay.js';
import fs from 'fs';
import path from 'path';

const AUTH_PATH = path.resolve('auth.json');

async function waitForSignIn(page, context) {
    // Check if Amazon is asking for sign-in
    const signInIndicators = [
        '#ap_email', '#ap_password', '#signInSubmit',
        'input[name="email"]', 'form[name="signIn"]',
        'h1:has-text("Sign in")', 'h1:has-text("Sign-In")'
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
        console.log("🔐 Amazon sign-in page detected. Please sign in manually in the browser...");
        console.log("   (The bot will automatically continue once you're signed in)");

        // Wait until the sign-in form disappears (user completed login)
        let signedIn = false;
        while (!signedIn) {
            await delay(3000);
            try {
                const url = page.url();
                // User has moved past the sign-in page
                if (!url.includes('/ap/signin') && !url.includes('/ap/forgotpassword')) {
                    signedIn = true;
                }
                // Also check if sign-in form is gone
                const emailField = page.locator('#ap_email');
                if (!(await emailField.isVisible({ timeout: 500 }))) {
                    signedIn = true;
                }
            } catch {
                signedIn = true; // page navigated away
            }
        }

        console.log("✅ Sign-in completed! Saving session...");
        await context.storageState({ path: AUTH_PATH });
        console.log("💾 auth.json saved — you won't need to sign in again.");
        await delay(2000);
    }
}

export async function runAmazonBot(product) {
    const browser = await chromium.launch({ headless: false });

    // Only load storageState if auth.json actually exists
    const contextOptions = fs.existsSync(AUTH_PATH) ? { storageState: AUTH_PATH } : {};
    const context = await browser.newContext(contextOptions);

    const page = await context.newPage();

    try {
        console.log(`🛒 Amazon Bot: Navigating to ${product.url}`);
        await page.goto(product.url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Wait for the page to fully render
        await delay(4000);

        // Check if Amazon is asking to sign in
        await waitForSignIn(page, context);

        let activePage = page;

        // Check if this is a search results page (fallback URL)
        const isSearchPage = product.url.includes('/s?k=');
        
        if (isSearchPage) {
            console.log("📋 Search results page detected — clicking first result...");
            
            const firstResult = activePage.locator('[data-component-type="s-search-result"] h2 a').first();
            if (await firstResult.isVisible({ timeout: 5000 })) {
                try {
                    const [newPage] = await Promise.all([
                        context.waitForEvent('page', { timeout: 5000 }),
                        firstResult.click()
                    ]);
                    await newPage.waitForLoadState('domcontentloaded');
                    activePage = newPage;
                    console.log("✅ Switched to new tab for Amazon product page");
                } catch (e) {
                    console.log("ℹ Product opened in same tab");
                }
                await delay(3000);
            } else {
                console.log("⚠ No search results found");
                return { success: false, message: "No search results found on Amazon" };
            }
        }

        // Try multiple selectors for the Buy Now button
        const buyNowSelectors = [
            '#buy-now-button',
            '#submit\\.buy-now-button', 
            'input[name="submit.buy-now"]',
            '#buyNow input',
            '#buyNow_feature_div input',
            'button:has-text("Buy Now")'
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
            // Fallback: try Add to Cart
            console.log("⚠ Buy Now not found, trying Add to Cart...");
            const addToCartSelectors = [
                '#add-to-cart-button',
                'input[name="submit.add-to-cart"]',
                'button:has-text("Add to Cart")'
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

        // After clicking Buy Now, Amazon may redirect to sign-in
        await waitForSignIn(activePage, context);

        // Capture the current URL (should be checkout or cart)
        const checkoutUrl = activePage.url();
        console.log(`🎯 Reached: ${checkoutUrl}`);
        console.log(`✅ Checkout reached for: ${product.name}`);

        // Keep browser open for user to complete payment
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
        console.error(`❌ Amazon Bot Error: ${err.message}`);
        return {
            success: false,
            message: err.message
        };
    }
    // NOTE: Not closing browser — user completes payment manually
}