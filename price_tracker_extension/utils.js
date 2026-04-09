function cleanPrice(text) {

    if (!text) return null

    return parseFloat(text.replace(/[₹,]/g, "").trim())
}

function getMarketplace() {

    if (location.hostname.includes("amazon"))
        return "amazon"

    if (location.hostname.includes("flipkart"))
        return "flipkart"

    return "unknown"
}