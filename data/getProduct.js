/*jslint node: true */
'use strict';

var task = require('subtask');

module.exports = function (product_id) {
    return task(function (cb) {
        // example: async call to get product
        setTimeout(function() {
            cb({
                title: 'this is sample product title (id=' + product_id + ')',
                description: 'sample product description',
                price: product_id * 100
            });
        }, 100);
    });
};
