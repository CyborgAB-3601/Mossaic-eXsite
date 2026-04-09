// content.js - Runs in the context of Amazon/Flipkart tabs

function extractProductInfo() {
  const url = window.location.href;
  let info = null;

  if (url.includes('amazon')) {
    const title = document.querySelector('#productTitle')?.innerText.trim();
    const image = document.querySelector('#landingImage')?.src;
    const priceText = document.querySelector('.a-price-whole')?.innerText.replace(/[^0-9]/g, '');
    if (title) {
      info = {
        title: title.split(' ').slice(0, 10).join(' '), // Shorten title
        image: image,
        price: priceText ? `₹${parseInt(priceText).toLocaleString()}` : 'Check Price',
        retailer: 'Amazon'
      };
    }
  } else if (url.includes('flipkart')) {
    const title = document.querySelector('.B_NuCI')?.innerText.trim();
    const image = document.querySelector('._396cs4')?.src;
    const priceText = document.querySelector('._30jeq3')?.innerText.replace(/[^0-9]/g, '');
    if (title) {
      info = {
        title: title.split(' ').slice(0, 10).join(' '),
        image: image,
        price: priceText ? `₹${parseInt(priceText).toLocaleString()}` : 'Check Price',
        retailer: 'Flipkart'
      };
    }
  }

  return info;
}

// Send info to popup when requested
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getProductInfo") {
    sendResponse(extractProductInfo());
  }
});
