$(function() {
    chrome.runtime.sendMessage({
        method: 'Loading',
    });
    scrapProducts();
});

scrapProducts = async () => {
    var products = [], that, rating, value, img, title, reviews, price, star, asin, words;
    var items = $('[data-component-type="s-search-result"].s-result-item');
    for (j = 0; j < items.length; j++) {
        that = $(items[j]);
        rating = that.find('.a-icon-alt').text();
        value = rating.split(' ')[0];
        if (value >= 3.0 && value <= 4.2) {
            img = that.find('.s-image').attr('src');
            title = that.find('h2 span').text();
            price = that.find('.a-price:not([data-a-strike]) .a-offscreen').text();
            reviews = that.find('a.a-link-normal .a-size-base').text();
            star = that.find('.a-icon.a-icon-star-small').attr('class');
            asin = that.data('asin');
            words = [];
            for (i = 3; i > 0; i--) {
                words = words.concat(await getReviews(asin, i));
                if (words.length >= 10) break;
            }
            products.push({
                img: img,
                title: title,
                price: price,
                reviews: reviews,
                rating: rating,
                star: star,
                words: words,
            });
        }
    }
    chrome.runtime.sendMessage({
        method: 'Products',
        products: products,
    });
}