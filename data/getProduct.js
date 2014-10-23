/*jslint node: true */
'use strict';

var apicalls = 0;

module.exports = function (product_id) {
    // example: input validation
console.log('product id: ' + product_id);
    if (!product_id) {
        return this.task();
    }

    return this.task(function (cb) {
        // example: async call to get product
        setTimeout(function() {
            // example: data validation after async tasks done
            if (Math.floor(product_id) != product_id) {
                return cb();
            }

            console.log('product api called ' + (++apicalls));

            cb({
                title: 'this is sample product title (id=' + product_id + ')',
                description: 'sample product description' + apicalls,
                price: product_id * 100,
            });
        }, 100);
    }, product_id);
};
