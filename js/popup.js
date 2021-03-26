var tabId = null;
chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (sender.tab && sender.tab.id == tabId) {
        if (request.method == 'Loading') {
            $('#loading').show();
        } else if (request.method == 'Products') {
            loadProducts(request.products);
        }
    }
});

$(async () => {
    tabId = await new Promise(e => {
        chrome.tabs.query({
            currentWindow: true,
            active : true
        }, t => {
            e(t[0].id);
        });
    });
    getProducts();

    $('#close').on('click', () => {
        window.close();
    });
});

getProducts = async () => {
    var products = await new Promise(e => {
        chrome.runtime.sendMessage({
            method: 'GetProducts',
            tabId: tabId,
        }, response => {
            e(response);
        })
    });
    loadProducts(products);
}

loadProducts = products => {
    if (!products) {
        $('.found').hide();
        $('.not-found').show();
        $('#loading').hide();
    } else if (products == 'loading') {
    } else if (products.length == 0) {
        $('.found').hide();
        $('.not-found').show();
        $('#loading').hide();
    } else {
        $('#number').text(products.length);
        var html = '';
        products.forEach(product => {
            html += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${product.img}" class="mr-2"><span>${product.title}</span>
                    </div>
                </td>
                <td>${product.price}</td>
                <td>${product.reviews}</td>
                <td><i class="${product.star}"></i><br>${product.rating}</td>
                <td>${product.words.join(' ')}</td>
            </tr>
            `;
        });
        $('#products').html(html);
        $('.not-found').hide();
        $('.found').show();
        $('#loading').hide();
    }
}