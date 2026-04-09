importScripts("supabase.js")

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.type === "STORE_PRODUCT") {
        storeProduct(message.payload).then((res) => {
            sendResponse({ status: "done", error: res?.error })
        })
        return true; // Keep message channel alive for async
    }

})