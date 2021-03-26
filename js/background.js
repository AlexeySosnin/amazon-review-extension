var products = [];

/* Start Event */
chrome.runtime.onMessage.addListener(async (request, sender, response) => {
    if (sender.tab) {
        if (request.method == 'Loading') {
            products[sender.tab.id] = 'loading';
        } else if (request.method == 'Products') {
            products[sender.tab.id] = request.products;
        }
    } else if (request.method == 'GetProducts') {
        response(products[request.tabId]);
    }
});

chrome.tabs.onRemoved.addListener(( tabId, removeInfo ) => {
    if (products[tabId]) {
        delete products[tabId];
    }
});

chrome.tabs.onUpdated.addListener((tabId, {status}) => {
    if (products[tabId] && status == 'loading') {
        delete products[tabId];
    }
});
/* End Event */