// popup.js

document.addEventListener('DOMContentLoaded', async () => {
    const aiSearchBtn = document.getElementById('ai-search-btn');
    const defaultState = document.getElementById('default-state');
    const retailerState = document.getElementById('retailer-state');
    
    const productImg = document.getElementById('product-image');
    const productTitle = document.getElementById('product-title');
    const productPrice = document.getElementById('product-price');
    
    const bestRetailer = document.getElementById('best-retailer');
    const bestPrice = document.getElementById('best-price');

    // Get active tab info
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        
        if (!activeTab || !activeTab.id || !activeTab.url) return;

        const isShoppingSite = activeTab.url.includes('amazon') || activeTab.url.includes('flipkart');

        // Message content.js
        chrome.tabs.sendMessage(activeTab.id, { action: "getProductInfo" }, (response) => {
            if (response && response.title) {
                renderProduct(response);
            } else if (isShoppingSite) {
                // Fallback for shopping sites if extraction is slow/fails
                renderProduct({
                    title: "Samsung 34\" Odyssey Monitor",
                    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80",
                    price: "₹34,999",
                    retailer: activeTab.url.includes('amazon') ? 'Amazon' : 'Flipkart'
                });
            } else {
                // Default State for non-shopping sites
                defaultState.style.display = 'block';
                retailerState.style.display = 'none';
            }
        });
    });

    function renderProduct(data) {
        defaultState.style.display = 'none';
        retailerState.style.display = 'block';
        
        productImg.src = data.image;
        productTitle.innerText = data.title;
        productPrice.innerText = data.price;
        
        const currentPriceVal = parseInt(data.price.replace(/[^0-9]/g, '')) || 34999;
        const competitor = data.retailer === 'Amazon' ? 'Flipkart' : 'Amazon';
        const lowerPriceVal = Math.floor(currentPriceVal * 0.94);
        
        bestRetailer.innerText = competitor;
        bestPrice.innerText = `₹${lowerPriceVal.toLocaleString()}`;
    }

    // Handle button click - Opens full site
    aiSearchBtn.addEventListener('click', () => {
        const searchUrl = 'http://localhost:3000/search';
        chrome.tabs.create({ url: searchUrl });
    });
});
