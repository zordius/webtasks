/*jslint node: true */
'use strict';

var apicalls = 0;

module.exports = function (product_id) {
    // example: input validation
    if (!product_id) {
        return this.dtask();
    }

console.log('data - get product ....' + product_id);

    return this.dtask(function (cb) {
console.log('in get product....');
        // example: async call to get product
        setTimeout(function() {
            // example: data validation after async tasks done
            if (Math.floor(product_id) != product_id) {
                return cb();
            }

            console.log('product api called ' + (++apicalls));

            cb({
                title: 'this is sample product title (id=' + product_id + ')',
                description: 'sample product description',
                price: product_id * 100,
            });
        }, 100);
    });
};
