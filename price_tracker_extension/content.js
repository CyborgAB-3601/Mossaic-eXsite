function isAmazonProductPage() {

    return location.pathname.includes("/dp/")
}

function isFlipkartProductPage() {

    return location.pathname.includes("/p/")
}


function extractAmazonData() {

    let title = document.querySelector("#productTitle")?.innerText?.trim()

    let priceText =
        document.querySelector(".a-price .a-offscreen")?.innerText ||
        document.querySelector("#corePriceDisplay_desktop_feature_div .a-price-whole")?.innerText ||
        document.querySelector("#corePrice_feature_div .a-offscreen")?.innerText ||
        document.querySelector(".a-price-whole")?.innerText ||
        document.querySelector(".a-color-price")?.innerText

    let ratingText =
        document.querySelector("span.a-icon-alt")?.innerText ||
        document.querySelector("[data-hook='rating-out-of-text']")?.innerText ||
        document.querySelector("#acrPopover")?.title ||
        document.querySelector("#acrPopover")?.innerText

    if (!title || !priceText) return null

    return {
        title: title,
        price: priceText,
        rating: ratingText
    }
}

function extractFlipkartData() {
    let title =
        document.querySelector("h1.v1zwn21k.v1zwn26._1psv1zeb9._1psv1ze0")?.innerText?.trim() ||
        document.querySelector("h1")?.innerText?.trim() ||
        document.querySelector("span.VU-ZEz")?.innerText?.trim() ||
        document.querySelector("span.B_NuCI")?.innerText?.trim() ||
        document.title.split('|')[0].trim()

    let priceText =
        document.querySelector("div.v1zwn21k.v1zwn20._1psv1zeb9._1psv1ze0")?.innerText ||
        document.querySelector("div.Nx9bqj.CxhGGd")?.innerText ||
        document.querySelector("div._30jeq3._16Jk6d")?.innerText ||
        document.querySelector("div.Nx9bqj")?.innerText

    let ratingText =
        document.querySelector("div.css-146c3p1")?.innerText ||
        document.querySelector("div.XQDdHH")?.innerText ||
        document.querySelector("div._3LWZlK")?.innerText

    if (!title || !priceText) return null

    return {
        title: title,
        price: priceText,
        rating: ratingText
    }
}

function collectProduct() {

    let data = null

    if (isAmazonProductPage())
        data = extractAmazonData()

    if (isFlipkartProductPage())
        data = extractFlipkartData()

    console.log("Extracted Data from page:", data)

    if (!data || !data.price || !data.title) {
        console.warn("Product data missing essential elements, halting:", data)
        alert(`Extraction Failed! Could not find product details.\n\nAre you sure this is a product page?\n\nExtracted: ${JSON.stringify(data || {})}`);
        return
    }

    // Replace all non-numeric characters except the dot
    const parsedPrice = parseFloat(data.price.replace(/[^\d.]/g, ""));
    const parsedRating = data.rating ? parseFloat(data.rating.replace(/[^\d.]/g, "")) : null;

    if (isNaN(parsedPrice)) {
        console.error("Failed to parse price:", data.price);
        return;
    }

    const payload = {
        product_name: data.title,
        price: parsedPrice,
        rating: isNaN(parsedRating) ? null : parsedRating,
        marketplace: location.hostname.includes("amazon") ? "amazon" : "flipkart",
        product_url: location.href.split("?")[0] // Avoid taking tracking query parameters
    }

    console.log("Sending payload to background script:", payload)

    if (!chrome.runtime || !chrome.runtime.sendMessage) {
        console.error("Extension context invalidated. Please refresh the page.");
        alert("The extension was reloaded. Please refresh this Flipkart page for it to work again!");
        return;
    }

    chrome.runtime.sendMessage({
        type: "STORE_PRODUCT",
        payload
    }, (response) => {
        if (!response) {
            console.error("No response from background script. Extension might have been reloaded.");
        } else if (response.error) {
            console.error("❌ SUPABASE REJECTED THE DATA:", response.error);
            alert("Supabase Error! Check Web Console for details.\n" + response.error);
        } else {
            console.log("✅ DATA SUCCESSFULLY STORED IN SUPABASE!");
        }
    })
}


setTimeout(collectProduct, 7000)