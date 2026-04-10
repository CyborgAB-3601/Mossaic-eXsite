import { getPendingJobs, updateJobStatus, createOrderLog } from '../services/jobService.js';
import { getProduct } from '../services/productService.js';
import { runAmazonBot } from '../bots/amazonBot.js';
import { runFlipkartBot } from '../bots/flipkartBot.js';

async function processJobs() {
    try {
        console.log("Checking for jobs...");

        const jobs = await getPendingJobs();

        for (const job of jobs) {
            console.log("Processing job:", job.id);

            await updateJobStatus(job.id, 'running');

            try {
                const product = await getProduct(job.product_id);

                // Determine the correct bot using both the platform field AND the URL
                // This prevents misrouting (e.g. Flipkart bot being used for Amazon URLs)
                let botPlatform = product.platform;
                if (product.url) {
                    if (product.url.includes('amazon.')) {
                        botPlatform = 'amazon';
                    } else if (product.url.includes('flipkart.')) {
                        botPlatform = 'flipkart';
                    }
                }

                let result;

                if (botPlatform === 'amazon') {
                    console.log(`🚀 Launching Amazon Bot for: ${product.name}`);
                    result = await runAmazonBot(product);
                } else if (botPlatform === 'flipkart') {
                    console.log(`🚀 Launching Flipkart Bot for: ${product.name}`);
                    result = await runFlipkartBot(product);
                } else {
                    // Default to Amazon if platform unknown
                    console.log(`⚠ Unknown platform "${botPlatform}", defaulting to Amazon Bot`);
                    result = await runAmazonBot(product);
                }

                await createOrderLog({
                    product_id: product.id,
                    status: result.success ? 'success' : 'failed',
                    response_log: result.message || ''
                });

                await updateJobStatus(job.id, result.success ? 'success' : 'failed');

            } catch (err) {
                console.error(err);
                await updateJobStatus(job.id, 'failed');
            }
        }
    } catch (globalErr) {
        console.error("Error checking or processing jobs:", globalErr);
    }
}

setInterval(processJobs, 10000); // every 10 sec