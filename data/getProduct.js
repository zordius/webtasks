/*jslint node: true */
'use strict';

var task = require('subtask');

module.exports = function (product_id) {
    // example: input validation
    if (!product_id) {
        return task();
    }

    return task(function (cb) {
        // example: async call to get product
        setTimeout(function() {
            // example: data validation
            if (Math.floor(product_id) != product_id) {
                return cb();
            }

            cb({
                title: 'this is sample product title (id=' + product_id + ')',
                description: 'sample product description',
                price: product_id * 100
            });
        }, 100);
    });
};
