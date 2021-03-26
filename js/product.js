$(function() {
    chrome.runtime.sendMessage({
        method: 'Loading',
    });
    scrapProduct();
});

scrapProduct = async () => {
    var products = [], rating, img, title, reviews, price, star, asin, words;
    rating = $('#averageCustomerReviews_feature_div .a-icon-alt').text();
    value = rating.split(' ')[0];
    if (value >= 3.0 && value <= 4.2) {
        img = $('#altImages .imageThumbnail img').eq(0).attr('src');
        title = $('#productTitle').text();
        price = $('#priceblock_ourprice').text();
        reviews = $('#acrCustomerReviewText').text().split(' ')[0];
        star = $('#acrPopover .a-icon.a-icon-star').eq(0).attr('class');
        asin = location.pathname.split('/dp/')[1].split('/')[0];
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
    chrome.runtime.sendMessage({
        method: 'Products',
        products: products,
    });
}