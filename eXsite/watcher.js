import { supabase } from './config/supabase.js';
import { chromium } from 'playwright';

async function watchPrices() {
    const { data: products } = await supabase
        .from('products')
        .select('*');

    for (const product of products) {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        await page.goto(product.url);

        const text = await page.locator('body').innerText();
        const price = parseInt(text.replace(/[^\d]/g, '').slice(0, 6));

        console.log(product.name, price);

        if (price <= product.target_price) {
            console.log("🔥 Trigger hit!");

            await supabase.from('jobs').insert({
                product_id: product.id,
                status: 'pending'
            });
        }

        await browser.close();
    }
}

setInterval(watchPrices, 60000);