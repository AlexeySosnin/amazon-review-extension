getReviews = async (asin, star) => {
    var category = ['', 'one_star', 'two_star', 'three_star'];
    return new Promise(e => {
        $.ajax({
            method: 'POST',
            url: 'https://www.amazon.com/hz/reviews-render/ajax/reviews/get/ref=cm_cr_unknown',
            headers: {
                accept: 'text/html, */*',
            },
            data: {
                sortBy: '',
                reviewerType: 'all_reviews',
                formatType: '',
                mediaType: '',
                filterByStar: category[star],
                pageNumber: 1,
                filterByLanguage: '',
                filterByKeyword: '',
                shouldAppend: undefined,
                deviceType: 'desktop',
                canShowIntHeader: undefined,
                reftag: 'cm_cr_unknown',
                pageSize: 10,
                asin: asin,
                scope: 'reviewsAjax0',
            },
            success: () => {
                e([]);
            },
            error: data => {
                var reviews = [], temp, elem;
                if (data.readyState == 4 && data.status == 200 && data.statusText == 'parsererror') {
                    data.responseText.split('&&&').forEach(d => {
                        try {
                            temp = JSON.parse(d);
                            if (temp[0] == 'append') {
                                elem = $('<div></div>').html(temp[2]).find('span[data-hook="review-body"] span').text();
                                if (elem) {
                                    reviews.push(elem);
                                }
                            }
                        } catch(err) {
                        }
                    });
                }
                e(reviews);
            }
        });
    });
}